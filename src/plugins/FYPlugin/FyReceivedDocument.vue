<!--

  @refreshAsideL 传值给父组件刷新AsideL

-->

<template>
  <div class="creatFile">
    <el-form :model="fileForm" ref="fileForm" label-position='left' label-width='120px'>
      <el-form-item label='收文路径'>
        <el-input v-model='dialogObj.projectPath' disabled></el-input>
      </el-form-item>
      <el-form-item label='标题'>
        <el-input v-model='fileForm.title'></el-input>
      </el-form-item>
      <el-form-item label='收文内容'>
        <el-input v-model='fileForm.content'></el-input>
      </el-form-item>
      <el-form-item label='需要回复日期'>
        <!-- <el-input v-model='fileForm.replyDeadline'></el-input> -->
        <el-date-picker type='datetime' v-model='fileForm.replyDeadline' placeholder='请选择时间' align='right'></el-date-picker>
      </el-form-item>
      <el-form-item label='收文人'>
        <div class='received-document-row'>
          <el-input v-model='fileForm.nameStr' disabled></el-input>
          <el-button type="primary" @click="onSelect" style='margin-left: 20px;'>选择</el-button>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footerBtn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit('fileForm')">确定</el-button>
    </span>
    <!-- 选择用户的dialog -->
    <SelectUser :dialogObj='selectUserDialog' @reData='reSelectUserData'
      appendToBody @selectedUser='selectedUser' :selected='fileForm.selected'/>
  </div>
</template>
<script>
import docAPI from "./api/services/doc";
// import proAPI from "../../api/services/project";
import { mapGetters } from "vuex";
import SelectUser from '../../components/Dialog/SelectUser'

import UserApi from "../../api/services/project";
// import UserApi2 from '../../api/services/doc'

export default {
  components: {
    SelectUser,
  },
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: function() {
        return {
          switch: false
        };
      }
    }
  },
  computed: {
    ...mapGetters("doc", ["List"])
  },
  data() {
    return {
      autoUpload: false,
      options: [],
      fileForm: {
        // 收文路径
        path: '',
        // 收文标题
        title: '',
        // 收文内容
        content: '',
        // 需要回复日期
        replyDeadline: '',
        // 发文人
        // 用于显示的字符串
        nameStr: '',
        // 选择的发文人的keyword list
        selected: [],
      },
      // 控制选择用户弹窗开关
      selectUserDialog: {
        switch: false,
        title: '增加用户/用户组'
      }
    };
  },
  methods: {
    // 打开选择发文人窗口
    onSelect() {
      this.selectUserDialog.switch = true
    },
    // 选择完发文人
    selectedUser(payload) {
      this.fileForm.nameStr = payload.nameStr
      this.fileForm.selected = payload.userList
      this.selectUserDialog.switch = false
    },
    // 关闭弹窗
    reSelectUserData() {
      this.selectUserDialog.switch = false
    },
    dialogClose() {
      this.$emit("reData", false);
    },
    cancel() {
      this.dialogClose();
      this.$refs["fileForm"].resetFields();
      this.file = [];
      this.autoUpload = false;
    },
    // 提交表单数据
    async submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let ProjectKeyWord = this.dialogObj.projectId;
          let attrJSON = [
            {
              Title: this.fileForm.title
            },
            {
              Content: this.fileForm.content
            },
            {
              ReplyDeadline: this.fileForm.replyDeadline,
            },
            {
              SenderList: this.fileForm.selected.map(i => i.id).join(',')
            }
          ]
          attrJSON = JSON.stringify(attrJSON);
          docAPI.NewReceiveDocument(ProjectKeyWord, attrJSON).then(async res => {
            if (res.success) {
              this.$message({
                message: "创建收文成功",
                type: "success"
              })
              this.$store.dispatch("workflow/getWorkFlow", res.data[0].DocKeyword);
              this.$store.dispatch("doc/getDocBaseAttr", res.data[0].DocKeyword);

              // const filterJson = '', page = 1, limit = 50
              // this.$store.dispatch('doc/getDocList', { ProjectKeyWord, filterJson, page, limit })
              // 跳转
              await this.getDocLocation(res.data[0].DocKeyword)
              this.$emit('refreshAsideL', res.data[0].DocKeyword)
              
              // 清除数据
              this.cancel()
              this.$emit("reData", false)
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 跳转
    async getDocLocation (e) {
      // 获取 ProjectKeyWord
      let Keyword = e, IgnoreShortCut = 'false'
      const res = await UserApi.getProjectPath(Keyword, IgnoreShortCut)
      const ProjectKeyWord = res.data[0].ProjectKeyword
      //  储存位置
      await UserApi.saveLastProject(ProjectKeyWord)
      //  获取列表
      const filterJson = '', page = 1, limit = 50
      this.$store.dispatch('doc/getDocList', { ProjectKeyWord, filterJson, page, limit })
    },
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          // this.getSendDocumentDefault();
        } else {
          return;
        }
      },
      immediate: true,
      deep: true
    },
    List: {
      handler(newValue) {
        if (newValue) {
          this.file = newValue;
        }
      }
    }
  }
};
</script>
<style lang="scss" scope>
.creatFile {
  .flexR {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .el-form-item__label {
    width: 100px;
  }
  .date {
    .el-input__prefix {
      display: none;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 15px;
    }
  }
  .uploadFileBox {
    display: inline-block;
    padding: 5px 15px;
    width: 61%;
    min-height: 110px;
    height: 100%;
    margin-right: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      line-height: 20px;
    }
    img {
      width: 4%;
      vertical-align: middle;
    }
  }
  .uploadItem {
    .el-form-item__content {
      display: flex;
      .uploadFileBox {
        flex: 7.5;
      }
      .fileUpload {
        flex: 1;
      }
    }
  }
  .fileUpload {
    display: inline-block;
    vertical-align: top;
  }
  .fileLine {
    text-align: center;
  }
}
.received-document-row {
  display: flex;
}
</style>
