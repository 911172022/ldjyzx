<template>
<div>
  <el-upload ref="upload" action="#" multiple :auto-upload="false" :on-change="handleChange" :show-file-list="false" :on-error="onError">
    <el-button id="ReplaceFile" ref="ReplaceFile" size="small" type="primary" icon="el-icon-upload2">上传</el-button>
  </el-upload>
  <!-- 进度条弹窗 -->
  <el-dialog title="上传文件" :visible.sync="progressVisible" width="40%" :before-close="CloseprogressDialog" :append-to-body="true" class="uploadProgress">
    <!-- 升级覆盖弹窗 -->
    <el-dialog title="确认文件替换" :visible.sync="UpgradeAndCoverVisible" :append-to-body="true" width="40%" center :before-close="CloseUpgradeAndCoverDialog">
      <span style="text-align: center;">目录下已存在同名文件（{{ questionFile }}）是否升级或覆盖?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmHandle('true')">升级</el-button>
        <el-button type="primary" @click="confirmAllHandle('allUpgrade');confirmHandle('true')">全部升级</el-button>
        <el-button type="primary" @click="confirmHandle('false')">覆盖</el-button>
        <el-button type="primary" @click="confirmAllHandle('allCover');confirmHandle('false')">全部覆盖</el-button>
      </span>
    </el-dialog>
    <el-table :data="fileData">
      <el-table-column prop="fileName" label="文件名"></el-table-column>
      <el-table-column prop="size" label="大小" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.size | filterSize(scope.row.size)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="进度" width="200">
        <template slot-scope="scope">
          <el-progress :stroke-width="20" :text-inside="true" :percentage="scope.row.progressBar"></el-progress>
        </template>
      </el-table-column>
      <!-- 2020.4.22-2 -->
      <el-table-column prop='cancel' width='40'>
        <template slot-scope='scope'>
          <span class='el-icon-close' @click='delectUpload(scope.row.fileName)'></span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="50">
          <template slot-scope="scope">
            <div class="delUpload" @click="cancelUpload(scope.row.uid)">×</div>
          </template>
        </el-table-column>-->
    </el-table>
    <span slot="footer">
      <div class="uploadDetails">已上传{{ percent2 }}% (共{{fileNum}}个文件), 上传速度：{{uploadSpeed}}{{unit}}</div>
    </span>
  </el-dialog>
  <!-- 2020.4.21-1 -->
  <!-- <InTray :dialogObj="InTrayData" @reData="reInTray" />
    <FyInTray :dialogObj="FyInTrayData" @reData="reFyInTray" /> -->
  <CommInTray :InTrayType='InTrayType' :docKeyWord="docKeyWord" @reIntrayData='reIntrayData' />
</div>
</template>
<script>
import UserApi2 from "../../api/services/file";
import UserApi3 from "../../api/services/doc";
import {
  TimeChange
} from "../../util/Time";
import {
  mapGetters
} from "vuex";
// const SIZE = 3 * 1024 * 1024; // 切块大小
const SIZE = 4158936;
export default {
  props: {
    uploadArr: {
      type: Array
    },
    autoUpload: {
      type: Boolean
    }
  },
  data() {
    return {
      // zy
      multiUploadSize: 4158936, //大于这个数值的文件使用断点续传
      eachSize: 4158936, //每块文件大小
      requestCancelUpload: [], //请求方法队列(取消上传)
      // 进度条显示详情
      // percent: 0,
      uploadSpeed: 0,
      fileData: [],
      unit: "",
      progressPercent: 0,
      progressArr: [],
      // 存放已经上传的文件大小
      resultValue: [],
      percentBox: [],
      //收文处理弹窗
      InTrayData: {
        switch: false
      },
      // zy end
      //方圆
      //收文处理弹窗
      FyInTrayData: {
        switch: false
      },
      // 2020.4.21-1
      InTrayType: null,
      docKeyWord: null,
      // 存放已经上传的文件大小 - 重复
      DuplicateUploadedFileSize: [],

      // 进度条弹窗
      // progressVisible: false,

      // 文件暂存
      fileList: [],
      TimeId: -1,

      // 升级覆盖弹窗
      UpgradeAndCoverVisible: false,
      // 升级覆盖弹窗弹窗 - 按钮全部
      isAll: "",
      // 升级覆盖弹窗弹窗 - 按钮返回值
      confirmUpgrade: "",

      // 暂存有重复的文件
      DuplicateFiles: [],
      DuplicateKeywords: [],
      ServerFullFileNames: [],
      i: 0,
      // 暂存没重复的文件
      nDuplicateFiles: [],
      nDuplicateKeywords: [],
      nServerFullFileNames: [],

      asdKeyWord: [],
      // 一个标志，放在上传里，一改变了就去判断要删除的任务是不是在上传的这个
      flag: true,
      flagFileName: '',
      // 放取消上传的文件名，因为在循环中停止上传的，不可以停止了立刻删除
      nDuplicateDelectFiles: [],
      DuplicateDelectFiles: [],
      // 关闭上传的整个弹窗时，上传任务暂停
      pauseFlag: false,
      // 用户确认关闭所有上传的开关
      cancelAllFlag: false,
      // 用户关闭上传的列表
      cancelFileList: [],

    };
  },
  filters: {
    filterSize(val) {
      if (val == 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    }
  },
  watch: {
    uploadArr: {
      handler(newValue) {
        if (newValue.length > 0) {
          this.fileList = newValue;
          this.DuplicateFileHandle();
        }
      },
      deep: true
    },
    progressVisible: {
      handler(newValue, oldValue) {
        if (!newValue && oldValue) {
          // 上传完了
          this.$emit('uploadCompleted')
        }
      }
    },

    autoUpload: {
      handler(newValue) {
        if (newValue) {
          this.DuplicateFileHandle();
        }
      },
      deep: true
    },
    fileData: {
      handler(newValue) {
        let vm = this
        // fileData 为空时，清空
        if (newValue.length == 0) {

          // vm.fileData = []
          vm.fileList = [];
          vm.$refs.upload.clearFiles();
          vm.i = 0
          const {
            ProjectKeyWord
          } = vm,
          filterJson = "",
            page = 1,
            limit = 50;
          vm.$store.dispatch("doc/getDocList", {
            ProjectKeyWord,
            filterJson,
            page,
            limit
          });
        }
        this.$emit('reData')
      }
    },
    fileList(v) {
      this.$emit('fileDataChange', v)
    }
  },
  computed: {
    ...mapGetters("doc", ["ProjectKeyWord"]),
    fileNum() {
      return this.fileData.length
    },
    // 进度
    percent2() {
      let uploadSize = 0
      // let cursor = 0
      let arr = this._$splitProgress(this.progressArr)
      try {
        for (let i = 0; i < arr.length; i++) {
          uploadSize += this.fileData[i].size * arr[i][arr[i].length - 1] * 0.01
        }
      } catch (TypeError) {
        return 0
      }
      let num = Math.round(uploadSize / this.allFileSize * 100)
      return num ? num : 0
    },
    // 总的要上传的文件大小
    allFileSize() {
      let size = 0
      for (let i = 0; i < this.fileData.length; i++) {
        size += this.fileData[i].size
      }
      return size
    },
    // 现在正在询问的文件
    questionFile() {
      try {
        return this.DuplicateFiles[this.i].name
      } catch (TypeError) {
        return ''
      }
    },
    progressVisible: {
      get() {
        return this.DuplicateFiles.length != 0 || this.nDuplicateFiles.length != 0
      },
      set(v) {
        return v
      }
    }
  },
  methods: {
    // 重置收发文弹窗
    reIntrayData() {
      this.InTrayType = null
    },
    cancelUpload() {},
    // 文件暂存
    handleChange(file, fileList) {
      this.fileList = [];
      this.fileList = fileList;
      this.$store.commit("doc/LIST", fileList);
      if (this.autoUpload) {
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
          this.DuplicateFileHandle();
        }, 500);
      }
    },
    // 第一步 - 判断是否有重复文件
    async DuplicateFileHandle() {
      let vm = this,
        {
          fileList
        } = vm,
        confirmUpgrade = "",
        st = false;
      console.log(vm.ProjectKeyWord)
      // 用于 创建发文和生成提资单表单中显示文件信息
      for (let i in fileList) {
        const res = await UserApi3.CreateDocByFileName(
          vm.ProjectKeyWord,
          fileList[i].name,
          confirmUpgrade
        );
        if (res.success) {
          // 有重复
          if (res.msg === "ConfirmUpgrade") {
            if (fileList[i].raw) {
              vm.DuplicateFiles.push(fileList[i].raw);
            } else {
              vm.DuplicateFiles.push(fileList[i]);
            }

            st = true;
          } else {
            // 没有重复, 会新建文件
            vm.nDuplicateKeywords.push(res.data[0].Keyword);
            if (fileList[i].raw) {
              vm.nDuplicateFiles.push(fileList[i].raw);
            } else {
              vm.nDuplicateFiles.push(fileList[i]);
            }
          }
        } else {
          vm.$message({
            message: res.msg,
            type: "error"
          });
        }
      }
      // 有重复开启升级覆盖弹窗
      if (st) {
        // vm.progressVisible = true;
        setTimeout(() => {
          vm.UpgradeAndCoverVisible = true;
        }, 500);
      }
      if (vm.nDuplicateFiles.length > 0) vm.beforeAvatarUpload();
    },
    // 第二步 - 没有重复文件
    async beforeAvatarUpload() {
      let vm = this,
        {
          nDuplicateFiles
        } = vm,
        {
          nDuplicateKeywords
        } = vm,
        arr = [];
      vm.fileData = [];
      for (let i in nDuplicateFiles) {
        let fileSize = nDuplicateFiles[i].size,
          ModifyDate = TimeChange(nDuplicateFiles[i].lastModifiedDate),
          ServerFileName = nDuplicateFiles[i].name,
          ObjectKeyword = nDuplicateKeywords[i],
          CreateDate = "";
        const res = await UserApi2.beforeUploadFile(
          ObjectKeyword,
          ServerFileName,
          CreateDate,
          ModifyDate,
          fileSize
        );
        if (res.success) {
          vm.nServerFullFileNames.push(res.data[0].ServerFullFileName);

          // resultValue 为是否已上传过该文件
          // 0 第一次上传, 大于0 第二次上传
          vm.resultValue.push({
            ServerFullFileName: res.data[0].ServerFullFileName,
            fileUploadedSize: res.data[0].resultValue
          });
          // 进度弹窗 - 文件讯息
          arr.push({
            fileName: nDuplicateFiles[i].name,
            size: nDuplicateFiles[i].size
          });
        } else {
          vm.$message({
            message: res.msg,
            type: "error"
          });
        }
      }
      for (let i = 0; i < arr.length; i++) {
        arr[i].progressBar = 0
        arr[i].isDuplicate = false
      }
      vm.fileData = arr;
      vm.httpRequest();
    },
    // 第三步 - 上传文件
    async httpRequest() {
      let vm = this,
        {
          nServerFullFileNames
        } = vm,
        len = nServerFullFileNames.length,
        {
          nDuplicateFiles
        } = vm,
        sTime = new Date().getTime(); // 获取上传开始时间

      // 打开上传开关
      vm.progressArr = [];
      // vm.percent = 0; // 已上传 %
      // vm.fileNum = len; // 共几个文件
      vm.uploadSpeed = 0; // 上传速度
      // 打开进度条弹窗
      // vm.progressVisible = true;


      // 全部要上传的文件
      for (let i = 0; i < len; i++) {
        // 先判断这个要上传的文件还在不在上传任务中
        // 跳过还未开始上传的文件的上传
        if (vm.fileData.map(i => {
            return i.fileName
          }).indexOf(nDuplicateFiles[i].name) == -1) {
          continue
        }
        for (let n = 0; n < vm.fileData.length; n++) {
          if (vm.fileData[n].fileName == nDuplicateFiles[i].name) {
            vm.fileData[n].progressBar = 0
          }
        }

        // 用户关闭所有上传任务
        if (this.cancelAllFlag) {
          break
        }

        // 第一步 - 计算每个文件总块数
        let data = [],
          UploadedChunks = 0;
        const fileChunkList = await this.createFileChunk(nDuplicateFiles[i]);
        data = fileChunkList.map(({
          file
        }) => ({
          chunk: file
        }));
        // 第二步 - 计算每个文件已经上传多少
        // resultValue 包含了ServerFullFileName和fileUploadedSize
        vm.resultValue.forEach(item => {
          if (item.fileUploadedSize > 0) {
            if (item.ServerFullFileName === nServerFullFileNames[i]) {
              UploadedChunks = Math.ceil(item.fileUploadedSize / SIZE);
            }
          }
        });

        // 每个文件内容
        // 下边文件分块要从跳过已上传的部分
        let j = 0 + UploadedChunks;
        for (j; j < data.length; j++) {
          let arr;
          // 单个被关闭
          if (!this.flag && this.flagFileName === nDuplicateFiles[i].name) {
            vm.progressPercent = 0
            let cursor = vm.progressArr.lastIndexOf(100)
            if (cursor == -1) {
              vm.progressArr = []
            } else {
              vm.progressArr = vm.progressArr.slice(0, cursor + 1)
            }
            arr = await vm._$splitProgress(vm.progressArr)

            // 把进度数据放入
            vm.fileData.forEach((item, index) => {
              arr.forEach((v, idx) => {
                if (index === idx) {
                  v.forEach(j => {
                    vm.$set(item, "progressBar", j);
                  });
                }
              });
            });
            vm.uploadSpeed = 0; // 上传速度
            break;
          }

          vm.percentBox = [];

          const res = await UserApi2.uploadFile2(
            nServerFullFileNames[i],
            data[j].chunk,
            data.length,
            j
          );

          // 计算上传速度
          let eTime = new Date().getTime(); // 结束时间
          let time = eTime - sTime; // 获取时间差
          let speed = data[j].chunk.size / 1024 / (time / 1000);
          vm.uploadSpeed = 0;
          //当前上传的文件大小除以时间差
          if (speed / 1024 > 1) {
            vm.uploadSpeed = (speed / 1024).toFixed(2);
            vm.unit = "M/s";
          } else {
            vm.uploadSpeed = speed.toFixed(2);
            vm.unit = "kb/s";
          }
          sTime = eTime;


					// let res = {}
					// await UserApi2.uploadFile2(
					// 	nServerFullFileNames[i],
          //   data[j].chunk,
          //   data.length,
          //   j
					// ).then(res1 => {
					// 	res = res1
					// }).catch(err => {
					// 	console.log(err)
					// })



          if (res.success) {
            // 计算分块上传进度条
            vm.progressPercent = Math.ceil(((j + 1) / data.length) * 100);

            vm.progressArr.push(vm.progressPercent);

            arr = await vm._$splitProgress(vm.progressArr);

            // 把进度数据放入
            vm.fileData.forEach((item, index) => {
              arr.forEach((v, idx) => {
                if (index === idx) {
                  v.forEach(j => {
                    vm.$set(item, "progressBar", j);
                  });
                }
              });
            });

            // let num = 0;
            // arr.forEach(item => {
            //   item.forEach(i => {
            //     if (i !== 100) {
            //       vm.percent = ((i + num) / len).toFixed(0);
            //     } else {
            //       vm.percentBox.push(i);
            //       num += i;
            //       vm.percent = (eval(vm.percentBox.join("+")) / len).toFixed(0);
            //     }
            //   });
            // });
            // 续传完成返回FINISH 则终止此次循环
            if (res.msg == "FINISH") {
              // 重置flag
              vm.flag = true
              vm.flagName = ''
              break;
            }
          } else {
            vm.$refs.upload.clearFiles();
            if (res.msg !== "") {
              vm.$message({
                message: res.msg,
                type: "error"
              });
            }
          }


          // 用户关闭所有上传任务
          if (this.cancelAllFlag) {
            break
          }
        }
      }

      await vm.onSuccess();
    },
    // 第四步 - 上传成功
    async onSuccess() {
      let vm = this,
        {
          nServerFullFileNames
        } = vm,
        {
          nDuplicateKeywords
        } = vm,
        len = nServerFullFileNames.length;
      for (let i = 0; i < len; i++) {
        const res = await UserApi2.afterUploadFile(
          nDuplicateKeywords[i],
          nServerFullFileNames[i]
        );
        if (res.success) {
          if (res.data[0].state === "uploadSuccess") {
            console.log(nDuplicateKeywords[i])
            const res2 = await UserApi3.afterCreateNewDocEvent(
              nDuplicateKeywords[i]
            );

            if (res2.success) {
              // // console.log(res2)
              // 关闭进度条
              // vm.progressVisible = false;
              vm.$message({
                message: "上传成功",
                type: "success"
              });
              // console.log(nDuplicateKeywords[i])

              // 2020.4.21-1
              if (res2.msg == "GetDocument" || res2.msg == 'FyGetDocument') {
                vm.InTrayType = res2.msg
                vm.docKeyWord = nDuplicateKeywords[i]
              }

              // // 在收文文件夹上传时 触发
              // if (res2.msg == "GetDocument") {
              //   this.InTrayData.switch = true;
              //   this.InTrayData.docKeyWord = nDuplicateKeywords[i];
              // }
              // // 方圆在收文文件夹上传时 触发
              // //debugger
              // // console.log(res2)
              // if (res2.msg == "FyGetDocument") {
              //   // console.log("start intray!!!")
              //   this.FyInTrayData.switch = true;
              //   this.FyInTrayData.docKeyWord = nDuplicateKeywords[i];
              // }
            }
          }
        }

      }


      // 看看fileData还有没有文件没上传，然后开始重复文件的上传
      // console.log(this.fileData, this.nDuplicateFiles, this.DuplicateFiles)
      // 判断要不要开始上传重复文件
      if (vm.fileData.length > vm.nDuplicateFiles.length) {
        vm.httpRequest2()
      } else {
        // 上传完了就清空fileData
        vm.fileData = []
        //
      }
      // vm.fileList = [];
      vm.nDuplicateFiles = [];
      vm.nDuplicateKeywords = [];
      vm.nServerFullFileNames = [];
      // vm.$refs.upload.clearFiles();
      // const { ProjectKeyWord } = vm,
      //   filterJson = "",
      //   page = 1,
      //   limit = 50;
      // vm.$store.dispatch("doc/getDocList", {
      //   ProjectKeyWord,
      //   filterJson,
      //   page,
      //   limit
      // });

    },
    // 升级覆盖弹窗按钮 - 全部升级,全部覆盖调用
    confirmAllHandle(e) {
      this.isAll = e;
    },
    // 升级覆盖弹窗按钮 - 单个
    // 按钮返回值
    async confirmHandle(e) {
      let vm = this,
        {
          DuplicateFiles,
          i
        } = vm,
        len = DuplicateFiles.length;
      vm.confirmUpgrade = e;

      for (i; i < len; i++) {
        vm.UpgradeAndCoverVisible = false;
        vm.i = i + 1;
        if (vm.isAll) {
          const res = await UserApi3.CreateDocByFileName(
            vm.ProjectKeyWord,
            vm.DuplicateFiles[i].name,
            vm.confirmUpgrade
          );

          vm.DuplicateKeywords.push({
            Keyword: res.data[0].Keyword,
            name: res.data[0].O_filename
          });
          if (vm.i === len) vm.beforeAvatarUpload2();
        } else {
          const res = await UserApi3.CreateDocByFileName(
            vm.ProjectKeyWord,
            vm.DuplicateFiles[i].name,
            vm.confirmUpgrade
          );

          vm.DuplicateKeywords.push({
            Keyword: res.data[0].Keyword,
            name: res.data[0].O_filename
          });
          if (vm.i !== len) {
            setTimeout(() => {
              vm.UpgradeAndCoverVisible = true;
            }, 500);
          } else {
            setTimeout(() => {
              vm.beforeAvatarUpload2();
            }, 500);
          }
          return;
        }
      }
    },
    // 第二步 - 有重复文件
    async beforeAvatarUpload2() {
      let vm = this,
        {
          DuplicateFiles,
          DuplicateKeywords
        } = vm,
        arr = [];

      // 用于 创建发文和生成提资单表单中显示文件信息
      vm.$store.commit("doc/LIST", DuplicateFiles);


      let removeFileList = []
      for (let i in DuplicateFiles) {
        let fileSize = DuplicateFiles[i].size,
          ModifyDate = TimeChange(DuplicateFiles[i].lastModifiedDate),
          ServerFileName = DuplicateKeywords[i].name,
          ObjectKeyword = DuplicateKeywords[i].Keyword,
          CreateDate = "";
        const res = await UserApi2.beforeUploadFile(
          ObjectKeyword,
          ServerFileName,
          CreateDate,
          ModifyDate,
          fileSize
        );

        if (res.success) {
          // 判断这里的resultValue是否为-1，为-1的话，说明文件已存在，把文件提出队列
          if (res.data[0].resultValue == -1) {
            // 将要删除的文件名字放入removeFileList，放在最后删除
            removeFileList.push(DuplicateFiles[i].name)
            this.$message({
              message: `该文件（${DuplicateFiles[i].name}）已存在！`,
              type: 'warning'
            })
          } else {
            vm.ServerFullFileNames.push(res.data[0].ServerFullFileName);
            // 进度弹窗 - 文件讯息
            arr.push({
              fileName: DuplicateFiles[i].name,
              size: DuplicateFiles[i].size
            });

            vm.DuplicateUploadedFileSize.push(res.data[0].resultValue);
          }
        } else {
          removeFileList.push(DuplicateFiles[i].name)
          vm.$message({
            message: res.msg,
            type: "error"
          });
        }
      }

      // 删除重复上传的队列
      vm.DuplicateFiles = vm.DuplicateFiles.filter(item => removeFileList.indexOf(item.name) == -1)

      for (let i in arr) {
        arr[i].progressBar = 0
      }

      vm.fileData = vm.fileData.concat(arr)
      if (vm.fileData.length == vm.DuplicateFiles.length) {
        vm.httpRequest2();

      }
    },
    // 第三步重复 - 上传文件
    async httpRequest2() {
      let vm = this,
        {
          ServerFullFileNames,
          DuplicateFiles
        } = vm,
        len = ServerFullFileNames.length,
        sTime = new Date().getTime(); // 获取上传开始时间

      // 判断这里开始上传之前有没有不重复的文件上传了
      if (vm.fileData.length == vm.DuplicateFiles.length) {
        vm.progressArr = [];
      }
      // vm.percent = 0; // 已上传 %
      vm.uploadSpeed = 0; // 上传速度


      for (let i = 0; i < len; i++) {
        // 先判断这个要上传的文件还在不在上传任务中
        // 跳过还未开始上传的文件的上传
        if (vm.fileData.map(i => {
            return i.fileName
          }).indexOf(DuplicateFiles[i].name) == -1) {
          continue
        }
        for (let n = 0; n < vm.fileData.length; n++) {
          if (vm.fileData[n].fileName == DuplicateFiles[i].name) {
            vm.fileData[n].progressBar = 0
          }
        }
        // 用户关闭所有上传任务
        if (this.cancelAllFlag) {
          break
        }


        // 第一步 - 计算每个文件总块数
        let data = [],
          UploadedChunks = 0;
        const fileChunkList = await this.createFileChunk(DuplicateFiles[i]);
        data = fileChunkList.map(({
          file
        }) => ({
          chunk: file
        }));
        // 第二步 - 计算每个文件已经上传多少
        vm.resultValue.forEach(item => {
          if (item.fileUploadedSize > 0) {
            if (item.ServerFullFileName === ServerFullFileNames[i]) {
              UploadedChunks = Math.ceil(item.fileUploadedSize / SIZE);
            }
          }
        });
        // 每个文件内容
        let j = 0 + UploadedChunks;
        for (j; j < data.length; j++) {
          let arr;

          // 单个被关闭
          if (!this.flag && this.flagFileName === DuplicateFiles[i].name) {
            vm.progressPercent = 0
            let cursor = vm.progressArr.lastIndexOf(100)
            if (cursor == -1) {
              vm.progressArr = []
            } else {
              vm.progressArr = vm.progressArr.slice(0, cursor + 1)
            }
            arr = await vm._$splitProgress(vm.progressArr)

            // 把进度数据放入
            vm.fileData.forEach((item, index) => {
              arr.forEach((v, idx) => {
                if (index === idx) {
                  v.forEach(j => {
                    vm.$set(item, "progressBar", j);
                  });
                }
              });
            });

            vm.uploadSpeed = 0; // 上传速度
            break;
          }

          vm.percentBox = [];

          const res = await UserApi2.uploadFile2(
            ServerFullFileNames[i],
            data[j].chunk,
            data.length,
            j
          );


          // 计算上传速度
          let eTime = new Date().getTime(); // 结束时间
          let time = eTime - sTime; // 获取时间差
          let speed = data[j].chunk.size / 1024 / (time / 1000);
          vm.uploadSpeed = 0;
          //当前上传的文件大小除以时间差
          if (speed / 1024 > 1) {
            vm.uploadSpeed = (speed / 1024).toFixed(2);
            vm.unit = "M/s";
          } else {
            vm.uploadSpeed = speed.toFixed(2);
            vm.unit = "kb/s";
          }
          sTime = eTime;


          console.log(res)
          if (res.success) {
            // 计算分块上传进度条
            vm.progressPercent = Math.ceil(((j + 1) / data.length) * 100);

            vm.progressArr.push(vm.progressPercent);

            arr = await vm._$splitProgress(vm.progressArr)

            // 把进度数据放入
            vm.fileData.forEach((item, index) => {
              arr.forEach((v, idx) => {
                if (index === idx) {
                  v.forEach(j => {
                    vm.$set(item, "progressBar", j);
                  });
                }
              });
            });
            // 总进度信息
            // let num = 0;
            // arr.forEach(item => {
            //   item.forEach(i => {
            //     if (i !== 100) {
            //       vm.percent = ((i + num) / len).toFixed(0);
            //     } else {
            //       vm.percentBox.push(i);
            //       num += i;
            //       vm.percent = (eval(vm.percentBox.join("+")) / len).toFixed(0);
            //     }
            //   });
            // });
            // 续传完成返回FINISH 则终止此次循环
            if (res.msg == "FINISH") {
              // 重置flag
              vm.flag = true
              vm.flagName = ''
              break;
            }
          } else {
            vm.$refs.upload.clearFiles();
            if (res.msg !== "") {
              vm.$message({
                message: res.msg,
                type: "error"
              });
            }
          }

          // 用户关闭所有上传任务
          if (this.cancelAllFlag) {
            break
          }

        }
      }

      vm.onSuccess2();
    },
    // 第四步重复 - 上传成功
    async onSuccess2() {
      let vm = this,
        {
          ServerFullFileNames
        } = vm,
        {
          DuplicateKeywords
        } = vm,
        len = ServerFullFileNames.length;
      for (let i = 0; i < len; i++) {
        const res = await UserApi2.afterUploadFile(
          DuplicateKeywords[i].Keyword,
          ServerFullFileNames[i]
        );
        if (res.success) {
          if (res.data[0].state === "uploadSuccess") {
            const res2 = await UserApi3.afterCreateNewDocEvent(
              DuplicateKeywords[i].Keyword
            );
            if (res2.success) {
              // 关闭进度条
              // this.progressVisible = false;
              vm.$message({
                message: "上传成功",
                type: "success"
              });
            }
          }
        }

      }
      // this.$emit("reData");
      vm.fileData = []
      // vm.fileList = [];
      vm.DuplicateFiles = [];
      vm.DuplicateKeywords = [];
      vm.ServerFullFileNames = [];
      vm.i = 0;
      vm.isAll = "";
      // vm.$refs.upload.clearFiles();
      // const filterJson = "",
      //   page = 1,
      //   limit = 50;
      // let { ProjectKeyWord } = vm;
      // vm.$store.dispatch("doc/getDocList", {
      //   ProjectKeyWord,
      //   filterJson,
      //   page,
      //   limit
      // });
    },
    // 生成文件切块
    createFileChunk(file, size = SIZE) {
      return new Promise((resolve, reject) => {
        try {
          const fileChunkList = [];
          let cur = 0;
          while (cur < file.size) {
            // 大小不超过 3M
            fileChunkList.push({
              file: file.slice(cur, cur + size)
            });
            cur += size;
          }
          resolve(fileChunkList);
        } catch (error) {
          reject(new Error("文件切块发生错误"));
        }
      });
    },
    // 拆分进度条数组
    _$splitProgress(arr, n = 100) {
      let start = 0;
      let res = [];
      while (arr.indexOf(n, start) > -1) {
        let end = arr.indexOf(n, start) + 1;
        res.push(arr.slice(start, end));
        start = end;
      }
      if (start < arr.length) {
        res.push(arr.slice(start));
      }
      return res;
    },
    // 上传文件失败
    onError() {
      this.$message.error("上传失败");
    },
    // 关闭进度条弹窗
    CloseprogressDialog(done) {
      // 暂停上传任务
      this.pauseFlag = true
      this.$confirm("终止上传？")
        .then(() => {
          this.cancelAllFlag = true
          this.handleClose();
          // this.progressVisible = false

          done();
        })
        .catch(() => {

        });
    },
    // 关闭升级覆盖弹窗
    CloseUpgradeAndCoverDialog(done) {
      this.$confirm("不上传此文件？")
        .then(() => {
          let vm = this
          // 现在选择的文件
          // let fileName = this.DuplicateFiles[vm.i].name
          // 将这个文件踢出队列
          this.DuplicateFiles.splice(vm.i, 1)
          let len = this.DuplicateFiles.length
          // 如果踢出的文件是最后一个，就开始下一步，否则继续打开面板
          if (vm.i !== len) {
            setTimeout(() => {
              vm.UpgradeAndCoverVisible = true;
            }, 500);
          } else {
            setTimeout(() => {
              vm.beforeAvatarUpload2();
            }, 500);
          }
          this.isAll = "";
          done();
        })
        .catch(() => {
          console.log("close")
        });
    },
    // 关闭所有上传
    handleClose() {
      let vm = this;
      vm.fileList = [];
      vm.DuplicateFiles = [];
      vm.DuplicateKeywords = [];
      vm.ServerFullFileNames = [];

      // 2020.5.19
      vm.nDuplicateFiles = []
      vm.nDuplicateKeywords = []
      vm.nServerFullFileNames = []
      vm.fileData = []
      vm.i = 0;
      vm.isAll = "";
      vm.$refs.upload.clearFiles();

      vm.flag = true
      vm.flagFileName = ''
      vm.pauseFlag = false
      vm.cancelAllFlag = false
      vm.cancelFileList = []
    },
    // reInTray(e) {
    //   this.InTrayData.switch = e;
    // },
    // reFyInTray(e) {
    //   this.FyInTrayData.switch = e;
    // }
    delectUpload(fileName) {
      // 在fileData中删除
      for (let i = 0; i < this.fileData.length; i++) {
        // let vm = this;
        if (this.fileData[i].fileName === fileName) {
          this.fileData.splice(i, 1)
          // 如果这个文件是已经上传完的，还要把progressArr里的这一个的删掉
          let arr = this._$splitProgress(this.progressArr)
          if (arr.length > i) {
            this.progressArr = this.progressArr.splice(this.progressArr.indexOf(100) + 1, this.progressArr.length)
          }
          break;
        }
      }
      this.flag = false
      this.flagFileName = fileName
    },
  }
};
</script>
<style lang="scss">
.uploadProgress {
    text-align-last: left;
    .delUpload {
        font-size: 20px;
        cursor: pointer;
        &:hover {
            color: #409eff;
        }
    }
    .uploadDetails {
        text-align: left;
        font-weight: bold;
    }
}
</style>

<style lang='scss'>
.el-icon-close {
    cursor: pointer;
}
</style>
