<template>
  <div>
    <el-dialog
      title="收文处理"
      :visible.sync="dialogObj.switch"
      width="50%"
      :before-close="dialogClose"
      :append-to-body="true"
      class="inTray"
    >
      <el-form :model="InTrayForm" ref="InTrayForm" v-if="dialogObj.switch == true">
        <el-form-item label="函数编码" :label-width="formLabelWidth" prop="num" class="inTrayTop">
          <el-col :span="6">
            <el-input v-model="InTrayForm.RootProjectCode" readonly />
            <div class="center">项目号</div>
          </el-col>
          <el-col :span="2" class="center">——</el-col>
          <el-col :span="6">
            <el-select v-model="InTrayForm.Company">
              <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <div class="center">发文单位</div>
          </el-col>
          <el-col :span="2" class="flexR">
            <div>——</div>
            <div>G</div>
          </el-col>
          <el-col :span="6">
            <el-input v-model="InTrayForm.DocNumber" />
            <div class="center">函数流水号</div>
          </el-col>
        </el-form-item>
        <el-form-item label="函数描述" :label-width="formLabelWidth" prop="desc" class="desc">
          <el-input :autosize="autosize" type="textarea" v-model="InTrayForm.desc" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit('InTrayForm')">确定</el-button>
      </span>
    </el-dialog>
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
  data() {
    return {
      formLabelWidth: "10%",
      InTrayForm: {
        RootProjectCode: "",
        Company: "",
        DocNumber: "",
        desc: ""
      },
      autosize: {
        minRows: 4
      },
      options: []
    };
  },
  computed: {
    ...mapGetters("doc", ["ProjectKeyWord"])
  },
  methods: {
    dialogClose() {
      this.$emit("reData", false);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let DocKeyword = this.dialogObj.docKeyWord;
          let attrJSON = [
            { name: "RootProject", value: this.InTrayForm.RootProjectCode },
            { name: "Company", value: this.InTrayForm.Company },
            { name: "Number", value: this.InTrayForm.DocNumber },
            { name: "Title", value: this.InTrayForm.desc }
          ];
          let docAttrJson = JSON.stringify(attrJSON);
          docAPI.receiveDocument(DocKeyword, docAttrJson).then(res => {
            if (res.success) {
              this.InTrayForm = {};
              this.dialogClose();
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.getProjectPath();
            } else {
              this.$message({
                message: "添加失败",
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
    getReceiveDocumentDefault() {
      let DocKeyword = this.dialogObj.docKeyWord;
      docAPI.getReceiveDocumentDefault(DocKeyword).then(res => {
        if (res.success) {
          this.InTrayForm = res.data[0];
        }
      });
    },
    cancel() {
      this.$refs["InTrayForm"].resetFields();
      this.dialogClose();
    },
    // 上次开启位置
    async getProjectPath() {
      //  储存位置
      await proAPI.saveLastProject(this.ProjectKeyWord);
      this.$store.commit("project/REFRESH_TREE", true);
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getReceiveDocumentDefault();
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style lang="scss" scope>
.inTray {
  text-align: left;
  .inTrayTop {
    .el-form-item__content {
      width: 100%;
    }
  }
  .flexR {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .center {
    text-align: center;
  }
}
</style>