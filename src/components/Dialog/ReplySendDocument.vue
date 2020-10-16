<!--
  收文文件回复弹窗
-->
<template>
<el-dialog :close-on-click-modal="false" :title="dialogObj.title" :visible.sync="dialogObj.switch" width="60%" :before-close="dialogClose">

  <el-form label-position='left' ref="form" :model="fileForm" label-width="80px">
    <el-form-item label="标题">
      <el-input v-model="fileForm.title"></el-input>
    </el-form-item>
  </el-form>
  <div class='attachementList'>
    <span>附件列表</span>
    <!-- <UploadFiles :uploadArr='uploadArr' :autoUpload='autoUpload' @fileDataChange='fileDataChange' @uploadCompleted='uploadCompleted'/> -->
    <uploadFiles2 :autoUpload='autoUpload' :rawFileList.sync='fileList' @uploadCompleted='uploadCompleted' :ProjectKeyWord='ProjectKeyWord'></uploadFiles2>
  </div>
  <div class='showListDiv'>
    <div v-for='file in fileList' :key='file.uid'>
      <div>
        {{ file.name }}
      </div>
      <div @click='removeFile(file)'>
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogClose">取 消</el-button>
    <el-button type="primary" size="small" @click="replySendDocumentHandle">确 定</el-button>
  </span>
</el-dialog>
</template>


<script>
import docApi from '../../plugins/FYPlugin/api/services/doc'
import { mapGetters } from 'vuex'

export default {
  props: {
    dialogObj: {
      type: Object,
      // 没有传参时才会被读取
      default: () => ({
        switch: false,
        title: '增加用户/用户组'
      })
    },
  },
  data() {
    return {
        fileForm: {
          title: ''
        },
        // 上传
        autoUpload: false,
        uploadArr: [],
        fileList: [],

        docKeyword: ''
    };
  },
  computed: {
        ...mapGetters("doc", ["ProjectKeyWord"]),
  },
  watch: {
    // dialogObj: {
    //   handler(newValue) {
    //     // console.log(newValue)
    //   },
    //   deep: true
    // },
  },
  methods: {
    // 关闭弹窗
    dialogClose() {
      this.$emit("reData", false)
      this.resetData()
    },
    resetData() {
      this.fileForm.title = ''
      this.uploadArr = []
      this.fileList = []
      this.docKeyword = ''
    },
    // 回复收文
    async replySendDocumentHandle() {
      const res = await docApi.GetWorkflowProject(this.dialogObj.wfKeyword)
      
      // 更新 ProjectKeyword， 否则上传不成功
      this.$store.commit('doc/PTYPE', res.data[0].ProjectKeyword)
      this.docKeyword = res.data[0].DocKeyword
      if (this.fileList.length > 0) {
        // 开始上传文件
        this.beginUploadFile()
      } else {
        this.replyDocument()
      }
    },
    // 开始上传文件
    beginUploadFile() {
      // this.uploadArr = this.fileList
      this.autoUpload = true
    },
    // // 用户选择了文件上传
    // fileDataChange(v) {
    //   this.fileList = v
    // },
    // 移除上传队列的某个文件
    removeFile(file) {
      let uid = file.uid
      let cursor = this.fileList.map(i => i.uid).indexOf(uid)
      if (cursor != -1) {
        this.fileList.splice(cursor, 1)
      }
    },
    // 完成上传了
    uploadCompleted() {
      this.replyDocument()
    },
    // 上传完文件，所有完成了，最终调用
    async replyDocument() {
      let attrJson = [
        {
          Title: this.fileForm.title
        },
      ]
      attrJson = JSON.stringify(attrJson);

      const res = await docApi.ReplyDocument(this.docKeyword, attrJson)
      if (res.success) {
        console.log(res)
        this.$message({
          message: '回复收文成功',
          type: 'success'
        })

        this.$store.dispatch("workflow/getWorkFlow", this.docKeyword);
        // 触发 流程工作台 asideL那里的刷新
        this.$store.commit('workflow/REFRESH_TRIGGER', true)
        // 清空之前流程的数据
        this.$store.commit('workflow/CLEAR_WORKFLOW')
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
      this.dialogClose()
    }
  }
}
</script>
<style lang="scss">
.addUser {
    .addUser_User {
        .userData {
            width: calc(100% - 30px);
        }
    }
    .addUser_UserGroup {
        .UserGroup {
            width: calc(100% - 30px);
        }
    }
    .AU-search {
        background-color: #f2f1f6;
        padding: 10px 20px 5px;
        border-radius: 7px 7px 0 0;
    }
    .AU-tree {
        border: 2px solid #f2f1f6;
        .filter-tree {
            height: 190px;
            overflow: auto;
            overflow-y: scroll;
        }
    }
    .AU-table {
        border: 2px solid #f2f1f6;
    }
}

.el-tree {
    border: 0;
    .el-tree-node__label {
        position: relative;
        padding-left: 30px;
    }
    .el-tree-node__label:before {
        content: "";
        position: absolute;
        background-image: url("../../assets/tree/Smallfolder.png");
        background-size: 20px;
        top: -3px;
        left: 0;
        z-index: 2;
        width: 20px;
        height: 20px;
    }
    .el-tree-node__content {
        padding: 5px;
    }
}
.attachementList {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.showListDiv {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  margin-top: 10px;
  min-height: 70px;
}
.showListDiv > div {
  margin: 20px 15px;
  display: flex;
  justify-content: space-between;


}
</style>
