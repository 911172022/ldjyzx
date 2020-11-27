<!--
    重写的上传控件
    :autoUpload 是否自动上传，如果为 true 自动上传，则用户点击上传选择完文件之后，立刻上传文件
                如果为 false ，当 改变 autoUpload 值为 true 时，再开始上传
    :rawFileList.sync 暴露出来的渲染出来的待上传列表 （配合上边的 autoUpload 为 false 用，用户控制上传时间）
    @uploadCompleted 文件上传完毕事件（不一定是上传成功了，但是事实上清空 fileList ） 
-->

<template>
  <div>
    <!-- 上传按钮 -->
    <el-upload
      ref="upload"
      action="#"
      multiple
      :auto-upload="false"
      :on-change="handleChange"
      :show-file-list="false"
      :on-error="onError"
    >
      <el-button
        id="ReplaceFile"
        ref="ReplaceFile"
        size="small"
        type="primary"
        icon="el-icon-upload2"
        >上传</el-button
      >
    </el-upload>
    <!-- 上传任务列表 进度弹窗 -->
    <el-dialog
      append-to-body
      title="上传文件"
      :visible.sync="progressVisible"
      width="90%"
      :before-close="openCloseDialog"
      class="uploadProgress"
      :close-on-click-modal="false"
    >
      <!-- 文件列表 -->
      <div class="uploadTaskWrapper">
        <table>
          <tr>
            <th>文件名</th>
            <th>大小</th>
            <th>进度</th>
            <th></th>
          </tr>
          <!-- v-show="!item.pause" -->
          <tr
            v-for="(item, index) in fileList"
            :key="index"
            v-show="!item.remove"
          >
            <td>
              <p style="margin-bottom: 5px">{{ item.rawFile.name }}</p>
              <p class="error-tip" v-if="item.pause">“{{ item.msg }}”</p>
            </td>
            <td>{{ item.rawFile.size | filterSize }}</td>
            <td style="min-width: 70px">
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="item.progressPercent"
              ></el-progress>
            </td>
            <td style="width: 15px; padding: 0 20px">
              <div class="remove-btn">
                <i
                  style="color: #67c23a"
                  class="el-icon-success"
                  v-show="item.completed"
                ></i>
                <i
                  style="cursor: pointer"
                  class="el-icon-error"
                  v-show="!item.completed && !item.pause"
                  @click="removeUpload(item.rawFile.uid)"
                ></i>
                <i
                  style="cursor: pointer"
                  class="el-icon-refresh-right"
                  v-show="item.pause"
                  @click="retryUpload(item.rawFile.uid)"
                ></i>
              </div>
            </td>
          </tr>
        </table>
        <div class="upload-info">
          <div>
            共{{ uploadQueueLength }}个文件，已上传{{
              uploadCompletedLength
            }}个文件。
          </div>
          <div>上传速度：{{ uploadSpeed | filterSize }} / s</div>
        </div>
      </div>
      <!-- 确认文件升级覆盖弹窗 -->
      <el-dialog
        title="确认文件替换"
        :visible.sync="upgradeAndCoverVisible"
        :before-close="closeUpgradeAndCoverDialog"
        :append-to-body="true"
      >
        <span>目录下已存在同名文件 {{ questionFile }}是否升级或覆盖</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmHandle('upgrade')"
            >升级</el-button
          >
          <el-button type="primary" @click="confirmHandle('allUpgrade')"
            >全部升级</el-button
          >
          <el-button type="primary" @click="confirmHandle('cover')"
            >覆盖</el-button
          >
          <el-button type="primary" @click="confirmHandle('allCover')"
            >全部覆盖</el-button
          >
        </span>
      </el-dialog>
      <!-- 确认关闭上传弹窗 -->
      <el-dialog
        :visible.sync="closeDialogVisible"
        :before-close="closeCloseDialog"
        :append-to-body="true"
        title="确认关闭上传？"
        width="400px"
      >
        <!-- <span>确认关闭上传？</span> -->
        <span style="display: block; text-align: center">
          <el-button @click="closeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCloseUpload">关闭</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <!-- 收文 回调 -->
    <CommInTray
      :InTrayType="InTrayType"
      :docKeyWord="docKeyWord"
      @reIntrayData="reIntrayData"
    />
  </div>
</template>

<script>
import uploadApi from "./api/uploadApi";
// import { mapGetters } from "vuex";
import { TimeChange } from "../../util/Time";
// import message from '../../api/services/message';

// 文件切块大小，1M 1块 （后台设置了分块大小不得超过4M）
// const SIZE = 1024 * 1024 * 1;
const SIZE = 1024 * 1024 * 0.25;

export default {
  props: {
    // 控制自动上传
    autoUpload: {
      type: Boolean,
    },
    // 暴露给父组件的 fileList
    rawFileList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 要上传到哪个文件夹
    ProjectKeyWord: {
      required: true,
    },
  },
  data() {
    return {
      // 保存handleChange时候的setTimeout的timeId
      timeId: -1,
      // 用户选择的文件列表
      fileList: [],

      // 记录当前询问的操作文件的下标
      checkFileIndex: -1,
      // 控制升级覆盖弹窗开关
      upgradeAndCoverVisible: false,
      // 控制确认关闭上传弹窗的开关
      closeDialogVisible: false,
      /* ------------------------------------------- */
      // 记录上传速度的
      // 块开始上传时间
      startUploadTime: -1,
      // 上传速度
      uploadSpeed: 0,

      // 是否正在上传文件
      uploading: false,

      // 收文回调
      InTrayType: "",
      docKeyWord: "",
    };
  },
  computed: {
    // ...mapGetters("doc", ["ProjectKeyWord"]),
    // 上传任务列表 进度条弹窗
    progressVisible: {
      get() {
        // 注意autoUpload
        if (!this.autoUpload) {
          return false;
        }

        for (let i in this.fileList) {
          // 没有暂停的，且没完成的
          if (
            // !this.fileList[i].pause &&
            // !this.fileList[i].completed

            // 只要任务不是被移除，和已完成的，就不关
            !this.fileList[i].remove &&
            !this.fileList[i].completed
          ) {
            return true;
          }
        }
        return false;
      },
      set(v) {
        return v;
      },
    },
    // 当前选择的文件的文件名
    questionFile() {
      if (this.fileList[this.checkFileIndex]) {
        return this.fileList[this.checkFileIndex].rawFile.name;
      }
      return "";
    },
    // 当前正在上传队列的文件长度（不算pause为true的）也不算remove为true的
    uploadQueueLength() {
      return this.fileList.filter((i) => !i.pause && !i.remove).length;
    },
    // 当前已完成上传的文件长度
    uploadCompletedLength() {
      return this.fileList.filter((i) => i.completed).length;
    },
  },
  watch: {
    // 如果弹窗要关闭了，说明所有的任务状态都为pause或completed或remove，清空任务列表
    progressVisible(v) {
      if (v === false) {
        // 统计这次上传任务，共上传成功几个
        if (this.uploadCompletedLength > 0) {
          let completedLength = this.uploadCompletedLength;
          this.setUploadLocalStorage(this.fileList);
          // 因为如果立刻弹窗的话，会跟上传x文件成功的弹窗贴一起，设个timeout
          setTimeout(() => {
            this.$message({
              message: `成功上传${completedLength}个文件。`,
              type: "success",
              duration: 6000,
            });
          }, 200);
          // // 调用父组件的 上传完成 方法
          // this.$emit("uploadCompleted");
          // // 刷新当前的 docList
          // this.$store.dispatch("doc/getDocList", {
          //     ProjectKeyWord: this.ProjectKeyWord,
          //     filterJson: "",
          //     page: 1,
          //     limit: 50
          // });
        }
        // 调用父组件的 上传完成 方法
        this.$emit("uploadCompleted");
        // 刷新当前的 docList
        this.$store.dispatch("doc/getDocList", {
          ProjectKeyWord: this.ProjectKeyWord,
          filterJson: "",
          page: 1,
          limit: 50,
        });
        this.fileList = [];
        this.$refs.upload.clearFiles();
      }
    },
    // 监听 rawFileList 的变化，替换 fileList
    // 但是需要fileList没有在上传
    rawFileList(v) {
      if (!this.autoUpload) {
        this.handleChange(null, v);
      }
    },
    // 监听 fileList ，将所有 pause 和 complete 的放入localStorage里
    fileList: {
      handler(v) {
        // 只需要在上传流程中的变化
        if (!this.progressVisible) {
          return;
        }
        // 在上传任务完成之后也要调用一下这个方法
        this.setUploadLocalStorage(v);
      },
      deep: true,
      immediate: true,
    },
    // 监听 autoUpload ，如果从 false 到 true，就表示要开始上传文件了
    autoUpload(newValue, oldValue) {
      if (!oldValue && newValue) {
        this.handleChange(null, this.rawFileList);
      }
    },
  },
  filters: {
    filterSize(val) {
      if (val == 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
    },
  },
  beforeDestroy() {
    // 页面销毁应该将所有任务暂停了（这个销毁是用户跳转去别的页面）
    this.confirmCloseUpload();
  },
  methods: {
    // 记录任务情况到localStorage
    setUploadLocalStorage(v) {
      // 最后上传的文件夹keyword
      localStorage.setItem("lastUploadProjectKeyWord", this.ProjectKeyWord);
      let fileNames = [];

      // 上传成功的要自己手动再set一次locaStorege，不知道为什么这里检测不出来
      for (let i in v) {
        if (!this.fileList[i].pause && !this.fileList[i].completed) {
          fileNames.push(this.fileList[i].rawFile.name);
        }
      }
      // 最后上传的文件名列表字符串，用 , 分割
      localStorage.setItem("uncompletedUploadList", fileNames.join(","));
      // 最后执行上传任务的用户是谁
      localStorage.setItem(
        "lastUploadUserName",
        localStorage.getItem("username")
      );
    },
    /* ------------------------------------------------------------ */
    // 用户选择完文件的钩子
    // 或者是 rawFileList 改变
    handleChange(file, fileList) {
      // 更新 rawFileList
      this.$emit("update:rawFileList", fileList);

      this.fileList = [];
      this.fileList = fileList.map((i) => {
        return {
          // 文件属性
          rawFile: {
            ...i,
            uid:
              i.uid ||
              new Date().getTime() +
                i.raw.lastModified +
                Math.floor(Math.random() * 100 + 1),
          },
          // 任务暂停标记（碰到上传出问题，服务器无响应等，用这个标记）
          pause: false,
          // 任务移除标记（手动移除，或者系统不允许上传标记）
          remove: false,
          // 升级或覆盖操作，默认''，之后的操作会更改
          confirmUpgrade: "",
          // 文件上传进度
          progressPercent: 0,
          // 任务完成标记
          completed: false,
          // 任务状态信息
          msg: "",
        };
      });
      this.$store.commit("doc/LIST", fileList);

      // 是否自动上传，用户选择完立刻开始上传
      if (this.autoUpload) {
        clearTimeout(this.timeId);
        this.timeId = setTimeout(() => {
          // 检查空文件
          for (let i in this.fileList) {
            if (this.fileList[i].rawFile.raw.size === 0) {
              this.$message({
                message: `请勿上传空文件：空文件${this.fileList[i].rawFile.name}`,
                type: "warning",
                duration: 5000,
              });
              // this.fileList[i].pause = true
              // 空文件，将任务踢出
              this.fileList[i].remove = true;
              this.fileList[i].msg = "空文件";
            }
          }

          // 上传第一步
          this.checkDuplicate();
        }, 500);
      }
    },
    /* ------------------------------------------------------------ */
    // 第一步，检查文件是不是重复的
    // 遍历fileList访问CreateDocByFileName接口，根据返回的数据给fileList那一项加入状态标记
    async checkDuplicate() {
      for (let i in this.fileList) {
        // 因为当所有任务都是暂停或者完成或者移除的时候（上传暂停了），是调用这个方法重新遍历上传的.
        if (
          this.fileList[i].pause ||
          this.fileList[i].remove ||
          this.fileList[i].completed
        ) {
          continue;
        }

        let res = await uploadApi.CreateDocByFileName(
          this.ProjectKeyWord,
          this.fileList[i].rawFile.name,
          // 第一次访问这个接口，confirmUpgrade 值默认为''
          this.fileList[i].rawFile.confirmUpgrade
        );
        // createDocByFileName 返回成功操作
        if (res.success) {
          // 该文件是重复文件，重复文件接下来要询问用户怎么操作，升版还是覆盖
          if (res.message === "ConfirmUpgrade") {
            this.fileList[i].isDuplicate = true;
          }
          // 该文件不是重复文件
          else {
            this.fileList[i].isDuplicate = false;
            // 将返回的信息保存在fileList的该文件里
            this.fileList[i].Keyword = res.data[0].Keyword;
            this.fileList[i].O_filename = res.data[0].O_filename;
            this.fileList[i].serverInfo = res.data[0];
          }
        }
        // createDocByFileName 返回失败操作
        else {
          // 有错，将该文件 pause 设为 true
          // this.fileList[i].pause = true;
          // 从这里就有错的，该直接踢出
          this.fileList[i].remove = true;
          this.fileList[i].msg = res.message;
          this.$message({
            message: `创建文件${this.fileList[i].rawFile.name}失败：${res.message}`,
            type: "error",
            duration: 10000,
          });
        }
      }

      this.recordDuplicateOperation();
    },
    /* ------------------------------------------------------------ */
    // 第二步，对fileList里被标记为重复的文件，询问用户接下来的操作
    recordDuplicateOperation() {
      for (let i in this.fileList) {
        // 任务暂停了的和任务不是重复的，都跳过
        if (this.fileList[i].pause || !this.fileList[i].isDuplicate) {
          continue;
        }
        // 任务已经标记了操作的，跳过
        if (
          this.fileList[i].confirmUpgrade === "true" ||
          this.fileList[i].confirmUpgrade === "false"
        ) {
          continue;
        }

        // 没有标记的重复任务，打开弹窗，记录当前index值，然后return
        this.checkFileIndex = i;
        this.upgradeAndCoverVisible = true;
        return;
      }

      // 所有文件都已经标记了操作的，再遍历一次，重复的文件再调用一次CreateDocByFileName获取文件信息
      this.recordDuplicateInfo();
    },
    // 用户对升级覆盖弹窗的操作
    confirmHandle(v) {
      // 升级当前文件
      if (v === "upgrade") {
        this.fileList[this.checkFileIndex].confirmUpgrade = "true";
      }
      // 覆盖当前文件
      else if (v === "cover") {
        this.fileList[this.checkFileIndex].confirmUpgrade = "false";
      }

      // 升级所有文件
      if (v === "allUpgrade") {
        for (
          ;
          this.checkFileIndex < this.fileList.length;
          this.checkFileIndex++
        ) {
          this.fileList[this.checkFileIndex].confirmUpgrade = "true";
        }
      }
      // 覆盖所有文件
      if (v === "allCover") {
        for (
          ;
          this.checkFileIndex < this.fileList.length;
          this.checkFileIndex++
        ) {
          this.fileList[this.checkFileIndex].confirmUpgrade = "false";
        }
      }

      // 关闭弹窗，重置index
      this.upgradeAndCoverVisible = false;
      this.checkFileIndex = -1;
      // 再次调用第二步
      this.recordDuplicateOperation();
    },
    // 关闭 升级覆盖弹窗 ，将该任务暂停（踢出）
    closeUpgradeAndCoverDialog(done) {
      // this.fileList[this.checkFileIndex].pause = true;
      this.fileList[this.checkFileIndex].remove = true;
      done();
      // 再调用第二步
      this.recordDuplicateOperation();
    },

    /* ------------------------------------------------------------ */
    // 第三步，将已经标记了的重复文件，再调用一次 CreateDocByFileName 来获取文件信息
    async recordDuplicateInfo() {
      for (let i in this.fileList) {
        // 任务暂停了的和任务不是重复的，都跳过，还有标记了移除的，也跳过
        if (
          this.fileList[i].pause ||
          !this.fileList[i].isDuplicate ||
          this.fileList[i].remove
        ) {
          continue;
        }

        let res = await uploadApi.CreateDocByFileName(
          this.ProjectKeyWord,
          this.fileList[i].rawFile.name,
          this.fileList[i].confirmUpgrade
        );

        // 成功了就把信息放入fileList
        if (res.success) {
          // 将返回的信息保存在fileList的该文件里
          this.fileList[i].Keyword = res.data[0].Keyword;
          this.fileList[i].O_filename = res.data[0].O_filename;
          this.fileList[i].serverInfo = res.data[0];
        }
        // 如果失败了就将这个文件踢出队列
        else {
          // 有错，将该文件 pause 设为 true
          // this.fileList[i].pause = true;
          // 错误的话将文件踢出
          this.fileList[i].remove = true;
          this.fileList[i].msg = res.message;
          this.$message({
            message: `创建文件${this.fileList[i].rawFile.name}失败：${res.message}`,
            type: "error",
            duration: 10000,
          });
        }
      }

      // 下一步准备顺序上传，上传前调用 beforeUploadFile 接口
      this.beforeUploadFiles();
    },
    /* ------------------------------------------------------------ */
    // 第四步，准备顺序上传，上传前调用 beforeUploadFile接口，上传文件信息
    async beforeUploadFiles() {
      for (let i in this.fileList) {
        // 被踢出的任务跳过
        if (this.fileList[i].pause || this.fileList[i].remove) {
          continue;
        }

        let ObjectKeyword = this.fileList[i].Keyword,
          ServerFileName = this.fileList[i].O_filename,
          CreateDate = "",
          ModifyDate = TimeChange(
            this.fileList[i].rawFile.raw.lastModifiedDate
          ),
          fileSize = this.fileList[i].rawFile.raw.size;
        // 将文件的信息传入 beforeUploadFile
        let res = await uploadApi.beforeUploadFile(
          ObjectKeyword,
          ServerFileName,
          CreateDate,
          ModifyDate,
          fileSize
        );

        // 成功后操作
        if (res.success) {
          if (
            res.data[0].resultValue === -1 ||
            res.data[0].resultValue === "-1"
          ) {
            // 说明是重复的文件
            // this.fileList[i].pause = true
            this.fileList[i].remove = true;
            this.fileList[i].msg = "系统存在相同文件";
            this.$message({
              message: `系统存在相同文件：${this.fileList[i].rawFile.name}，请勿重复上传`,
              type: "warning",
            });
          } else {
            // 记录 ServerFullFileName 和 fileUploadedSize
            // fileUploadedSize 为是否已经上传过这个文件（指上传过但没上传完成，用于断点续传）
            this.fileList[i].serverFullFileName =
              res.data[0].ServerFullFileName;
            this.fileList[i].fileUploadedSize = res.data[0].resultValue;
          }
        }
        // 如果失败了就将这个文件踢出队列
        else {
          // 有错，将该文件 pause 设为 true
          // this.fileList[i].pause = true;
          // 直接将文件踢出
          this.fileList[i].remove = true;
          this.fileList[i].msg = res.message;
          this.$message({
            message: `创建文件${this.fileList[i].rawFile.name}失败：${res.message}`,
            type: "error",
            duration: 10000,
          });
        }
      }
      // 获取到了文件信息后，将文件分块
      this.setFilesChunks();
    },
    /* ------------------------------------------------------------ */
    // 第五步，将要上传的文件进行分块
    setFilesChunks() {
      for (let i in this.fileList) {
        // 跳过踢出了的文件
        if (this.fileList[i].pause || this.fileList[i].remove) {
          continue;
        }

        // 文件切块
        try {
          let fileChunks = [];
          let cursor = 0;
          while (cursor < this.fileList[i].rawFile.size) {
            fileChunks.push({
              file: this.fileList[i].rawFile.raw.slice(cursor, cursor + SIZE),
              uploaded:
                this.fileList[i].fileUploadedSize > cursor ? true : false,
            });
            cursor += SIZE;
          }
          this.fileList[i].fileChunks = fileChunks;

          // 计算文件上传进度
          this.fileList[i].progressPercent = this.progressPercent(
            this.fileList[i].fileChunks
          );
        } catch (error) {
          this.$message({
            message: `${this.fileList[i].rawFile.name}创建文件切块失败，${error}`,
            type: "error",
            duration: 10000,
          });
          this.fileList[i].pause = true;
          continue;
        }
      }
      console.log(this.fileList);
      // this.uploadFiles();
    },

    /* ------------------------------------------------------------ */
    // 第六步，开始顺序上传文件
    async uploadFiles() {
      this.uploading = true;
      // 命名 遍历fileList上传文件的循环
      fileListLoop: for (let i in this.fileList) {
        // 跳过暂停的文件
        if (this.fileList[i].pause || this.fileList[i].remove) {
          continue;
        }

        // 命名 一个文件分块上传的循环
        // 遍历要上传的文件的分块列表，上传没有上传的
        chunksLoop: for (let j in this.fileList[i].fileChunks) {
          // 如果当前分块被标记为已上传了，就跳过
          if (this.fileList[i].fileChunks[j].uploaded) {
            continue chunksLoop;
          }

          // 记录上传的时间，用于计算上传速度
          // this.startUploadTime = new Date().getTime();

          // 记录时间
          let timeRecord = new Date().getTime();
          // let uploadedRecord = 0;

          // 命名 上传失败重试的循环
          // reTryLoop:
          // 如果文件上传发生错误了，有 10 次机会重新上传该分块的文件，如果 10 次都失败了，再报错
          for (let re = 0; re < 10; re++) {
            // 终止上传，在上传分块失败重复上传循环中
            if (this.fileList[i].pause) {
              continue fileListLoop;
            }

            // 上传分块
            let res = await uploadApi
              .uploadFile(
                // 文件服务器全路径
                this.fileList[i].serverFullFileName,
                // 分块数据
                this.fileList[i].fileChunks[j].file,
                // 总分块数
                this.fileList[i].fileChunks.length,
                // 现在上传的是第几个分块
                j,
                // 进度控制
                (progressEvent) => {
                  /**
                   * {
                   *  total:
                   *  type: "progress"
                   *  loaded:
                   * }
                   *
                   */
                  // 需要注意，这个只是写入 http request 的进度，并没有真正获取到 http response，所以这里应该永远不要直接到进度 100
                  let progressWrite = parseInt(
                    ((j * SIZE + progressEvent.loaded) /
                      this.fileList[i].rawFile.size) *
                      100
                  );
                  progressWrite =
                    progressWrite > 1 ? progressWrite - 1 : progressWrite;
                  // 这里的 progressEvent.loaded 不仅仅是上传的file的大小，所以会有些偏差导致progress > 100
                  if (progressWrite >= 100) {
                    progressWrite = 99;
                  }
                  if (this.fileList[i].progressPercent >= progressWrite) {
                    // 发生什么错误触发了retry
                    this.uploadedSpeed = this.uploadedSpeed / 2;
                  } else {
                    // 正常的上传
                    this.fileList[i].progressPercent =
                      this.fileList[i].progressPercent <= progressWrite
                        ? progressWrite
                        : this.fileList[i].progressPercent;
                    let takeTime = (new Date().getTime() - timeRecord) / 1000;
                    this.uploadSpeed = progressEvent.loaded / takeTime;
                  }
                }
              )
              .catch((err) => {
                console.log(err);
              });

            if (res) {
              if (res.success) {
                // 上传成功了就将这一个分块数据标记为已上传
                this.fileList[i].fileChunks[j].uploaded = true;
                // 计算进度条数据
                this.fileList[i].progressPercent = this.progressPercent(
                  this.fileList[i].fileChunks
                );

                // // 计算上传速度，计算 1M 数据块耗时，
                // // 毫秒单位 转 秒
                // let takeTime =
                //     (new Date().getTime() -
                //         this.startUploadTime) /
                //     1000;

                // this.uploadSpeed =
                //     this.fileList[i].fileChunks[j].file.size /
                //     takeTime;

                break;
              } else {
                // 如果返回的data里是空的，大概就是不能上传一模一样的文件
                if (res.message.length === 0) {
                  res.message = "系统存在完全相同文件，请勿重复上传。";
                }
                // 上传失败
                this.fileList[i].pause = true;
                this.fileList[i].msg = res.message;
                this.$message({
                  message: `文件${this.fileList[i].rawFile.name}上传失败：${res.message}`,
                  type: "error",
                  duration: 10000,
                });
                // 开始下一个文件的上传
                continue fileListLoop;
              }
            }
            // 能到这里的话说明分块上传超时或者什么失败了，将上传速度置0
            this.uploadSpeed = 0;
          }

          // 终止上传的，在循环上传分块中
          // 用户手动终止上传，移除任务
          if (this.fileList[i].pause || this.fileList[i].remove) {
            continue fileListLoop;
          }

          // 判断这个分块有没有上传成功，如果已经重试10次都失败了，就报错了
          if (!this.fileList[i].fileChunks[j].uploaded) {
            this.fileList[i].pause = true;
            this.fileList[i].msg = "连接超时";
            this.$message({
              message: `文件${this.fileList[i].rawFile.name}上传失败：连接超时。`,
              type: "error",
              duration: 10000,
            });
          }
        }

        // 终止上传了就不onSuccess了
        // 在循环上传fileList中
        if (this.fileList[i].pause || this.fileList[i].remove) {
          continue fileListLoop;
        }

        // 一个文件上传完之后就调用
        await this.onSuccess(i);
      }
      this.uploading = false;

      // 重新去检查是否有没上传完的任务（用户点击了重试）
      for (let i in this.fileList) {
        // 没有pause，没有remove，没有completed的，就是要上传的
        if (
          !this.fileList[i].pause &&
          !this.fileList[i].remove &&
          !this.fileList[i].completed
        ) {
          this.checkDuplicate();
        }
      }
    },
    /* ------------------------------------------------------------ */
    // 第七步，上传完一个文件之后调用接口
    async onSuccess(i) {
      // 先验证是不是全部都上传完，再调用接口
      for (let j in this.fileList[i].fileChunks) {
        if (!this.fileList[i].fileChunks[j].uploaded) {
          return;
        }
      }
      // 调用上传完的接口 afterUploadFile
      let res = await uploadApi.afterUploadFile(
        this.fileList[i].Keyword,
        this.fileList[i].serverFullFileName
      );

      // 上传成功
      if (res.success) {
        if (res.data[0].state === "uploadSuccess") {
          // 添加上传完成状态
          this.fileList[i].completed = true;
          this.$message({
            message: `文件${this.fileList[i].O_filename} 上传成功！`,
            type: "success",
            duration: 6000,
          });
          // 确认上传成功之后刷新 docList
          this.$store.dispatch("doc/getDocList", {
            ProjectKeyWord: this.ProjectKeyWord,
            filterJson: "",
            page: 1,
            limit: 50,
          });

          // 上传成功之后要访问的接口
          let res2 = await uploadApi.afterCreateNewDocEvent(
            this.fileList[i].Keyword
          );

          if (res2.success) {
            // 收文弹窗
            if (res2.msg === "GetDocument" || res2.msg === "FyGetDocument") {
              this.InTrayType = res.message;
              this.docKeyWord = this.fileList[i].Keyword;
            }
          } else {
            console.log(res2);
          }
        } else {
          this.fileList[i].pause = true;
          this.fileList[
            i
          ].msg = `${this.fileList[i].O_filename}上传完回调失败：${res.message}`;
          this.$message({
            message: `${this.fileList[i].O_filename}上传完回调失败：${res.message}`,
            type: "warning",
            duration: 6000,
          });
        }
      } else {
        this.fileList[i].pause = true;
        this.fileList[
          i
        ].msg = `${this.fileList[i].O_filename}上传完回调失败：${res.message}`;
        this.$message({
          message: `${this.fileList[i].O_filename}上传完回调失败：${res.message}`,
          type: "warning",
          duration: 6000,
        });
      }
    },
    /* ------------------------------------------------------------ */
    // 计算进度条
    progressPercent(chunks) {
      return parseInt(
        (chunks.filter((i) => i.uploaded).length / chunks.length) * 100
      );
    },
    /* ------------------------------------------------------------ */
    // 暂停某个文件的上传
    removeUpload(uid) {
      for (let i in this.fileList) {
        if (this.fileList[i].rawFile.uid === uid) {
          // this.fileList[i].pause = true;
          this.fileList[i].remove = true;
          // 重置上传速度
          this.uploadSpeed = 0;
          return;
        }
      }
    },
    // 点击重试某个文件上传
    retryUpload(uid) {
      for (let i in this.fileList) {
        if (this.fileList[i].rawFile.uid === uid) {
          this.fileList[i].pause = false;
          this.fileList[i].remove = false;
          if (!this.uploading) {
            this.checkDuplicate();
          }
          return;
        }
      }
    },
    // 选择文件出现错误
    onError(e) {
      console.log(e);
    },
    /* ------------------------------------------------------------ */
    // 因为 elementui 的 dialog beforeClose 要传的是方法
    // 开启询问是否关闭弹窗
    openCloseDialog() {
      this.closeDialogVisible = true;
    },
    closeCloseDialog() {
      this.closeDialogVisible = false;
    },
    // 关闭上传任务列表 进度条弹窗前 回调
    closeProgressDialog() {
      // 将所有任务的 pause 设为 true
      for (let i in this.fileList) {
        // this.fileList[i].pause = true;
        this.fileList[i].remove = true;
      }
      this.progressVisible = false;
    },
    // 关闭所有任务
    confirmCloseUpload() {
      // 关闭询问是否关闭的弹窗
      this.closeDialogVisible = false;
      // 清空任务，关闭进度条弹窗
      this.closeProgressDialog();
    },
    // 清空所有数据
    clearHandle() {
      this.fileList = [];
      // 上传速度清 0
      this.uploadSpeed = 0;
      this.startUploadTime = -1;
    },
    /* ------------------------------------------------------------ */
    // 重置收发文弹窗
    reIntrayData() {
      this.InTrayType = "";
      this.docKeyWord = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.uploadTaskWrapper {
  width: 100%;
  table {
    width: 100%;
    border-collapse: collapse;
    td,
    th {
      padding: 12px 0;
      border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    }
  }
}
.error-tip {
  margin: 0;
  font-size: 10px;
  color: red;
}
.remove-btn-wrapper {
  width: 40px;
  margin-left: 20px;
}
.remove-btn {
  text-align: center;
  width: 100%;
}
.upload-info {
  margin-top: 10px;
}
.upload-info > div:first-child {
  margin-bottom: 10px;
}
</style>

<style>
.uploadProgress > .el-dialog {
  max-width: 700px;
}
</style>