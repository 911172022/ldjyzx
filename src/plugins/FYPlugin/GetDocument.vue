<template>
  <div class="newMessage">
    <el-dialog
      title="新建厂家信息"
      :visible.sync="dialogObj.switch"
      width="60%"
      :before-close="dialogClose"
    >
      <el-row>
        <el-col :span="12">
          <el-table :data="tableData" height="530" style="width: 100%;" @row-click="handleClick">
            <el-table-column prop="companyCode" label="编码"></el-table-column>
            <el-table-column prop="companyChinese" label="名称" width="180"></el-table-column>
            <el-table-column prop="province" label="省份" width="100"></el-table-column>
            <el-table-column prop="postCode" label="邮政" width="100"></el-table-column>
            <el-table-column prop="eMail" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="receiver" label="收件人" width="150"></el-table-column>
            <el-table-column prop="faxNo" label="传真号" width="150"></el-table-column>
            <el-table-column prop="phone" label="电话" width="150"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-form :model="newMesForm" ref="newMesForm">
            <el-form-item label="厂家编码:" :label-width="formLabelWidth">
              <el-input v-model="newMesForm.companyCode" />
            </el-form-item>
            <el-form-item label="厂家名称:" :label-width="formLabelWidth">
              <el-input v-model="newMesForm.companyChinese" />
            </el-form-item>
            <el-form-item label="厂家地址:" :label-width="formLabelWidth">
              <el-input v-model="newMesForm.address" />
            </el-form-item>
            <el-form-item label="厂家省份:" :label-width="formLabelWidth">
              <el-input v-model="newMesForm.province" />
            </el-form-item>
            <el-form-item label="厂家邮政:" :label-width="formLabelWidth">
              <el-input v-model="newMesForm.postCode" />
            </el-form-item>
            <el-form-item label="厂家邮箱:" :label-width="formLabelWidth">
              <el-input v-model="newMesForm.eMail" />
            </el-form-item>
            <el-form-item label="厂家收件人:" :label-width="formLabelWidth">
              <el-input v-model="newMesForm.receiver" />
            </el-form-item>
            <el-form-item label="厂家传真号:" :label-width="formLabelWidth">
              <el-input v-model="newMesForm.faxNo" />
            </el-form-item>
            <el-form-item label="收件人电话:" :label-width="formLabelWidth">
              <el-input v-model="newMesForm.phone" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="footerBtn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit('newMesForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import companyAPI from "./api/services/company";
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
  computed: { ...mapGetters("project", ["ProjectKeyWord"]) },
  data() {
    return {
      formLabelWidth: "30%",
      tableData: [],
      //新建厂家信息
      newMesForm: {
        companyCode: "",
        companyChinese: "",
        address: "",
        province: "",
        postCode: "",
        eMail: "",
        receiver: "",
        faxNo: "",
        phone: ""
      }
    };
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getCompany();
        } else {
          return;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleClick(val) {
      this.newMesForm = val;
    },
    dialogClose() {
      this.$emit("reData", false);
    },
    cancel() {
      this.dialogClose();
      this.newMesForm = {};
      this.$refs["newMesForm"].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let ProjectKeyWord = this.ProjectKeyWord;
          let projectAttrJson = [
            {
              name: "companyCode",
              value: this.newMesForm.companyCode
            },
            {
              name: "companyChinese",
              value: this.newMesForm.companyChinese
            },
            { name: "address", value: this.newMesForm.address },
            { name: "province", value: this.newMesForm.province },
            { name: "postCode", value: this.newMesForm.postCode },
            { name: "eMail", value: this.newMesForm.eMail },
            { name: "receiver", value: this.newMesForm.receiver },
            { name: "faxNo", value: this.newMesForm.faxNo },
            { name: "phone", value: this.newMesForm.phone }
          ];
          let strJSON = JSON.stringify(projectAttrJson);
          companyAPI.editCompany(ProjectKeyWord, strJSON).then(res => {
            if (res.success) {
              this.cancel();
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.getProjectPath();
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
    getCompany() {
      let ProjectKeyword = this.ProjectKeyWord;
      companyAPI.getEditCompanyDefault(ProjectKeyword).then(res => {
        if (res.success) {
          this.tableData = res.data[0].CompanyList;
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    },
    // 上次开启位置
    async getProjectPath() {
      //  储存位置
      await proAPI.saveLastProject(this.ProjectKeyWord);
      this.$store.commit("project/REFRESH_TREE", true);
    }
  }
};
</script>
<style lang="scss">
</style>