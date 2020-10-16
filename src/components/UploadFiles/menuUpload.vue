<template>
  <div>
    <el-upload
      ref="upload"
      action="#"
      multiple
      :auto-upload="false"
      :on-change="handleChange"
      :show-file-list="false"
      :on-error="onError">
      <slot>上传<i class="el-icon-edit"></i></slot>
    </el-upload>
    <!-- 升级覆盖弹窗 -->
    <el-dialog
      title="确认文件替换"
      :visible.sync="upgradeDialogVisible"
      width="40%"
      center
      :before-close="handleClose">
      <span style="text-align: center;">目录下已存在同名文件是否升级或覆盖?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmHandle('true')">升级</el-button>
        <el-button type="primary" @click="confirmAllHandle('allUpgrade');confirmHandle('true')">全部升级</el-button>
        <el-button type="primary" @click="confirmHandle('false')">覆盖</el-button>
        <el-button type="primary" @click="confirmAllHandle('allCover');confirmHandle('false')">全部覆盖</el-button>
      </span>
    </el-dialog>
    <InTray :dialogObj="InTrayData" @reData="reInTray" />
  </div>
</template>
<script>
import UserApi2 from '../../api/services/file'
import UserApi3 from '../../api/services/doc'
import { TimeChange } from '../../util/Time'
import { mapGetters } from 'vuex'
const SIZE = 3 * 1024 * 1024; // 切片大小

export default {
  props: {
    uploadArr: {
      type: Array,
    }
  },
  data () {
    return {
      UpgradeAndCoverVisible: false,
      // 文件暂存
      fileList: [],
      TimeId: -1,

      // 弹窗 - 开关
      upgradeDialogVisible: false,
      // 弹窗 - 按钮全部
      isAll: '',
      // 弹窗 - 按钮返回值
      confirmUpgrade: '',

      // 暂存有重复的文件
      DuplicateFiles: [],
      DuplicateKeywords: [],
      ServerFullFileNames: [],
      i: 0,
      // 暂存没重复的文件
      nDuplicateFiles: [],
      nDuplicateKeywords: [],
      nServerFullFileNames: [],

      container: {
        file: null
      },
      data: [],

      //收文处理弹窗
      InTrayData: {
        switch: false
      },
      //收文处理弹窗
      FyInTrayData: {
        switch: false
      },
    }
  },
  watch: {
    uploadArr: {
      handler(newValue) {
        if (newValue.length > 0) {
          this.fileList = newValue
          this.DuplicateFileHandle()
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('doc', ['ProjectKeyWord'])
  },
  methods: {
    // 文件暂存
    handleChange (file, fileList) {
      this.fileList = fileList
      clearTimeout(this.TimeId);
      this.TimeId = setTimeout(() => {
        this.DuplicateFileHandle()
      }, 500)
    },
    // 第一步 - 判断是否有重复文件
    async DuplicateFileHandle () {
      let vm = this, {fileList} = vm, len = fileList.length, confirmUpgrade = '', st = false
      for(let i = 0; i < len; i++) {
        const res = await UserApi3.CreateDocByFileName(this.ProjectKeyWord, fileList[i].name, confirmUpgrade)
        if (res.success) {
          // 有重复
          if (res.msg === 'ConfirmUpgrade') {
            st = true
            if (fileList[i].raw) {
              vm.DuplicateFiles.push(fileList[i].raw)
            } else {
              vm.DuplicateFiles.push(fileList[i])
            }
          } else {
            // 没有重复, 会新建文件
            vm.nDuplicateKeywords.push(res.data[0].Keyword)
            if (fileList[i].raw) {
              vm.nDuplicateFiles.push(fileList[i].raw)
            } else {
              vm.nDuplicateFiles.push(fileList[i])
            }
          }
        }
      }
      if (st) vm.upgradeDialogVisible = true
      if (vm.nDuplicateFiles.length > 0) vm.beforeAvatarUpload()
    },
    // 第二步 - 没有重复文件
    async beforeAvatarUpload () {
      let vm = this, {nDuplicateFiles} = vm, {nDuplicateKeywords} = vm, len = nDuplicateFiles.length
      for(let i = 0; i < len; i++) {
        let fileSize = nDuplicateFiles[i].size,
            ModifyDate = TimeChange(nDuplicateFiles[i].lastModifiedDate),
            ServerFileName = nDuplicateFiles[i].name,
            ObjectKeyword = nDuplicateKeywords[i],
            CreateDate = ''
            
        
        this.container.file = null
        this.container.file = nDuplicateFiles[i]
        const fileChunkList = this.createFileChunk(this.container.file)
        this.data = fileChunkList.map(({ file }) => ({
          chunk: file,
          // hash: this.container.file.name + "-" + index // 文件名 + 数组下标
        }))
        
        const res = await UserApi2.beforeUploadFile(ObjectKeyword, ServerFileName, CreateDate, ModifyDate, fileSize)
        if (res.success) {
          vm.nServerFullFileNames.push(res.data[0].ServerFullFileName)
        } else {
          vm.$message({ message: res.msg, type: 'error' })
        }
      }
      vm.httpRequest()
    },
    // 第三步 - 上传文件
    async httpRequest () {
      let vm = this, {nServerFullFileNames} = vm, len = nServerFullFileNames.length
      for(let i = 0; i < len; i++) {
        const sid = vm.$store.getters.sid
        const {data} = vm
        for (let index in data) {
          let formData = new FormData()
          formData.append("sid", sid)
          formData.append("C", 'AVEVA.CDMS.WebApi.FileController')
          formData.append("A", 'UploadFile')
          formData.append("ServerFullFileName", nServerFullFileNames[i])
          formData.append("Files", data[index].chunk)
          formData.append("chunk", index)
          formData.append("chunks", vm.data.length)
          const res = await UserApi2.uploadFile(formData)
          if (!res.success) {
            vm.$message({ message: '上传失败', type: 'error' })
            return
          }
        }
      }
      await vm.onSuccess()
    },
    // 第四步 - 上传成功
    async onSuccess () {
      let vm = this, {nServerFullFileNames} = vm, {nDuplicateKeywords} = vm, len = nServerFullFileNames.length
      for(let i = 0; i < len; i++) {
        const res = await UserApi2.afterUploadFile(nDuplicateKeywords[i], nServerFullFileNames[i])
        if (res.data[0].state === 'uploadSuccess') {
          const res2 = await UserApi3.afterCreateNewDocEvent(nDuplicateKeywords[i])
          if (res2.success) {
            vm.$message({ message: '上传成功', type: 'success' })
            // 在收文文件夹上传时 触发
            UserApi3.afterCreateNewDocEvent(nDuplicateKeywords[i]).then(res => {
              // if (res.success && res.msg !== "") {
              //   this.InTrayData.switch = true
              //   this.InTrayData.docKeyWord = nDuplicateKeywords[i]
              // }
               if (res.success && res.msg !== "") {
                this.FyInTrayData.switch = true
                this.FyInTrayData.docKeyWord = nDuplicateKeywords[i]
              }
            })
          }
        }
      }
      vm.fileList = []
      vm.nDuplicateFiles = []
      vm.nDuplicateKeywords = []
      vm.nServerFullFileNames = []
      vm.$refs.upload.clearFiles()
      const { ProjectKeyWord } = vm, filterJson = '', page = 1, limit = 50
      vm.$store.dispatch('doc/getDocList', { ProjectKeyWord, filterJson, page, limit })
    },
    reInTray(e) {
      this.InTrayData.switch = e
    },
    // 弹窗按钮 - 全部
    confirmAllHandle (e) {
      this.isAll = e
    },
    // 弹窗按钮 - 单个
    // 按钮返回值
    async confirmHandle (e) {
      let vm = this, {DuplicateFiles} = vm, len = DuplicateFiles.length, {i} = vm
      vm.confirmUpgrade = e
      for(i; i < len; i++) {
        vm.upgradeDialogVisible = false
        vm.i = i + 1
        if (vm.isAll) {
          const res = await UserApi3.CreateDocByFileName(vm.ProjectKeyWord, vm.DuplicateFiles[i].name, vm.confirmUpgrade)
          vm.DuplicateKeywords.push({
            Keyword: res.data[0].Keyword,
            name: res.data[0].O_filename
          })
          if (vm.i === len) vm.beforeAvatarUpload2()
        } else {
          const res = await UserApi3.CreateDocByFileName(vm.ProjectKeyWord, vm.DuplicateFiles[i].name, vm.confirmUpgrade)
          vm.DuplicateKeywords.push({
            Keyword: res.data[0].Keyword,
            name: res.data[0].O_filename
          })
          if (vm.i !== len) {
            setTimeout(() => {
              vm.upgradeDialogVisible = true
            }, 500)
          } else {
            setTimeout(() => {
              vm.beforeAvatarUpload2()
            }, 500)
          }
          return
        }
      }
    },
    // 第二步 - 有重复文件
    async beforeAvatarUpload2 () {
      let vm = this, {DuplicateFiles} = vm, {DuplicateKeywords} = vm, len = DuplicateFiles.length
      for(let i = 0; i < len; i++) {
        let fileSize = DuplicateFiles[i].size,
            ModifyDate = TimeChange(DuplicateFiles[i].lastModifiedDate),
            ServerFileName = DuplicateKeywords[i].name,
            ObjectKeyword = DuplicateKeywords[i].Keyword,
            CreateDate = ''
        const res = await UserApi2.beforeUploadFile(ObjectKeyword, ServerFileName, CreateDate, ModifyDate, fileSize)
        if (res.success) {
          vm.ServerFullFileNames.push(res.data[0].ServerFullFileName)
        } else {
          vm.$message({ message: res.msg, type: 'error' })
        }
      }
      vm.httpRequest2()
    },
    // 第三步重复 - 上传文件
    async httpRequest2 () {
      let vm = this, {ServerFullFileNames} = vm, {DuplicateFiles} = vm, len = ServerFullFileNames.length
      for(let i = 0; i < len; i++) {
        await UserApi2.uploadFile(ServerFullFileNames[i], DuplicateFiles[i])
      }
      vm.onSuccess2()
    },
    // 第四步重复 - 上传成功
    async onSuccess2 () {
      let vm = this, {ServerFullFileNames} = vm, {DuplicateKeywords} = vm, len = ServerFullFileNames.length
      for(let i = 0; i < len; i++) {
        const res = await UserApi2.afterUploadFile(DuplicateKeywords[i].Keyword, ServerFullFileNames[i])
        if (res.data[0].state === 'uploadSuccess') {
          const res2 = await UserApi3.afterCreateNewDocEvent(DuplicateKeywords[i].Keyword)
          if (res2.success) {
            vm.$message({ message: '上传成功', type: 'success' })
          }
        }
      }
      this.$emit('reData')
      vm.fileList = []
      vm.DuplicateFiles = []
      vm.DuplicateKeywords = []
      vm.ServerFullFileNames = []
      vm.i = 0
      vm.isAll = ''
      vm.$refs.upload.clearFiles()
      const filterJson = '', page = 1, limit = 50
      let { ProjectKeyWord } = vm
      vm.$store.dispatch('doc/getDocList', { ProjectKeyWord, filterJson, page, limit })
      
    },
    // 生成文件切片
    createFileChunk(file, size = SIZE) {
     const fileChunkList = [];
      let cur = 0
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      return fileChunkList
    },
    // 上传文件失败
    onError() {
      this.$message.error('上传失败')
    },
    // 关闭升级覆盖弹窗
    handleClose () {
      let vm = this
      vm.fileList = []
      vm.DuplicateFiles = []
      vm.DuplicateKeywords = []
      vm.ServerFullFileNames = []
      vm.i = 0
      vm.isAll = ''
      vm.$refs.upload.clearFiles()
    }
  }
}
</script>
