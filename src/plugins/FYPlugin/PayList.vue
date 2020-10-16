<template>
  <div class="payList">
    <el-form :model="payForm" ref="payForm">
      <el-form-item label="工程名称" prop="PrjName">
        <el-input v-model="payForm.PrjName" disabled />
      </el-form-item>
      <el-form-item label="工程编号" prop="PrjCode">
        <el-input v-model="payForm.PrjCode" disabled />
      </el-form-item>
      <el-form-item label="设计阶段" prop="Phase">
        <el-input v-model="payForm.Phase" readonly />
      </el-form-item>
      <el-form-item label="资料单编号" prop="DocNum">
        <el-input v-model="payForm.DocNum1" style="width: 35%" />&nbsp;字第
        <el-input v-model="payForm.DocNum2" style="width: 35%" />&nbsp;号
      </el-form-item>
      <el-form-item label="提出专业" prop="OutProfession">
        <el-input v-model="payForm.OutProfession" disabled />
      </el-form-item>
      <el-form-item label="接收专业" class="major" prop="checkList">
        <el-checkbox-group v-model="checkList" @change="changePression">
          <el-checkbox
            v-for="(item,index) in payForm.PressionList"
            :key="index"
            :label="item.Pression"
          >{{item.Pression}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="签收人" prop="man">
        <el-input v-model="payForm.man" placeholder="请先为选择的专业设置好主设人" disabled />
      </el-form-item>
      <el-form-item label="资料标题" prop="title">
        <el-input v-model="payForm.title" />
      </el-form-item>
      <el-form-item label="资料内容" prop="content">
        <el-input type="textarea" :autosize="autoSize" v-model="payForm.content" />
      </el-form-item>
      <el-form-item label="附件" class="payFiles" prop="file">
        <div class="uploadFileBox">
          <ul v-if="file">
            <li class="el-upload-list__item is-ready" v-for="(item,index) in file" :key="index">
              <a class="el-upload-list__item-name">
                <img :src="item.src" alt />
                {{item.name}}
              </a>
              <!-- <i class="el-icon-close" @click="handleRemove(index)"></i> -->
            </li>
          </ul>
        </div>
        <div class="fileUpload">
          <UploadFiles :uploadArr="UploadFiles" :autoUpload="autoUpload" @reData="reFiles" />
        </div>
      </el-form-item>
      <el-form-item label="资料重要性" prop="radio">
        <el-radio-group v-model="payForm.radio">
          <el-radio label="一般资料">一般资料</el-radio>
          <el-radio label="综合性重要资料">综合性重要资料</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footerBtn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit('payForm')">确定</el-button>
    </span>
  </div>
</template>
<script>
import docAPI from "./api/services/doc";
import proAPI from "../../api/services/project";
import { mapGetters } from "vuex";
export default {
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
      autoSize: {
        minRows: 5
      },
      checkList: [],
      formLabelWidth: "10%",
      payForm: {
        man: "",
        title: "",
        content: "",
        radio: "一般资料"
      },
      file: [],
      ExchangeType: "", //互提资料的类型
      UploadFiles: [],
      pid: ""
    };
  },
  methods: {
    // 启动工作流程
    start(keyword, doclist) {
      let docKeyword = keyword,
        DocList = doclist;
      docAPI.exchangeDocStartWorkFlow(docKeyword, DocList).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "启动成功"
          });
          this.cancel();
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
          this.cancel();
        }
      });
    },
    //选择专业，签收人处自动出现对应的人员
    changePression(e) {
      let vm = this,
        pression = vm.payForm.PressionList,
        arr = [];
      vm.payForm.man = "";
      for (let i = 0; i < pression.length; i++) {
        if (e.indexOf(pression[i].Pression) != -1 && pression[i].OwnerUser) {
          arr.push(pression[i].OwnerUser);
          vm.payForm.man = arr.join(",");
        }
      }
      this.$forceUpdate();
    },
    dialogClose() {
      this.$emit("reData", false);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let ProjectKeyword = this.dialogObj.projectId,
            ExchangeType = this.ExchangeType;
          let attrJson = [
            { name: "PrjName", value: this.payForm.PrjName },
            { name: "PrjCode", value: this.payForm.PrjCode },
            { name: "Phase", value: this.payForm.Phase },
            { name: "DocNum1", value: this.payForm.DocNum1 },
            { name: "DocNum2", value: this.payForm.DocNum2 },
            { name: "OutProfession", value: this.payForm.OutProfession },
            { name: "ProfessionList", value: this.checkList.join(",") },
            { name: "Receiver", value: this.payForm.man },
            { name: "Title", value: this.payForm.title },
            { name: "Content", value: this.payForm.content },
            { name: "PriImport", value: this.payForm.radio }
          ];
          let docAttrJson = JSON.stringify(attrJson);
          docAPI
            .createExchangeDoc(ProjectKeyword, ExchangeType, docAttrJson)
            .then(res => {
              if (res.success) {
                this.$store.commit("doc/PTYPE", res.data[0].ProjectKeyword);
                this.autoUpload = true;
                this.getProjectPath(res.data[0].ProjectKeyword);
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.start(res.data[0].DocKeyword, res.data[0].DocList);
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
    cancel() {
      this.dialogClose();
      this.$refs["payForm"].resetFields();
      this.file = [];
      this.checkList = [];
      this.autoUpload = false;
    },
    reFiles() {
      let { pid } = this;
      this.$set(this.$refs.DocList.store.states.lazyTreeNodeMap, pid, []);
    },
    //获取生成提资单默认参数
    getExchangeDocDefault() {
      let ProjectKeyword = this.dialogObj.projectId,
        ExchangeType = this.ExchangeType;
      docAPI.getExchangeDocDefault(ProjectKeyword, ExchangeType).then(res => {
        if (res.success) {
          this.payForm = res.data[0];
        }
      });
    },
    // 开启位置
    async getProjectPath(projectKeyword) {
      //  储存位置
      await proAPI.saveLastProject(projectKeyword);
      this.$store.commit("project/REFRESH_TREE", true);
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          if (newValue.title.indexOf("生成") != -1) {
            this.ExchangeType = "Create";
          } else if (newValue.title.indexOf("升版") != -1) {
            this.ExchangeType = "UpEdition";
          } else {
            this.ExchangeType = "Continue";
          }
          this.getExchangeDocDefault();
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
.payList {
  .el-input,
  .el-textarea {
    width: 80%;
  }
  .el-form-item__label {
    width: 100px;
  }
  .fileUpload {
    display: inline-block;
    vertical-align: top;
  }
  .major {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .el-form-item__content {
      flex: 10;
    }
  }
  .uploadFileBox {
    display: inline-block;
    padding: 5px 15px;
    width: 54%;
    min-height: 110px;
    height: 100%;
    margin-right: 18px;
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
      vertical-align: middle;
      width: 5%;
    }
  }
  .payFiles {
    .el-form-item__content {
      display: flex;
      .uploadFileBox {
        flex: 3.8;
      }
      .fileUpload {
        flex: 1;
      }
    }
  }
  .el-checkbox {
    width: 150px;
    margin-right: 0;
  }
}
</style>