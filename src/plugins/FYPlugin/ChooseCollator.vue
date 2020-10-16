<template>
  <div>
    <el-dialog
      title="主任选择校核审人员"
      :visible.sync="dialogObj.switch"
      width="60%"
      :before-close="dialogClose"
      class="collator"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <span>选择校核审人员</span>
          <el-form :model="collatorForm" ref="collatorForm">
            <el-table
              border
              height="450"
              :data="collatorForm.collatorData"
              class="collatorTable"
              style="width: 100%;"
              ref="collatorTable"
            >
              <el-table-column prop="projectName" label="项目名称"></el-table-column>
              <el-table-column prop="docName" label="任务名称"></el-table-column>
              <el-table-column prop="workflowName" label="流程名称" width="110"></el-table-column>
              <el-table-column prop="checker" label="校核人" width="160">
                <template slot-scope="scope">
                  <el-form-item
                    type="selection"
                    :prop="'collatorData.' + scope.$index + '.checker'"
                    :rules="collatorForm.rules.checker"
                  >
                    <el-input v-model="scope.row.checker" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="auditor" label="审核人" width="160">
                <template slot-scope="scope">
                  <el-form-item
                    type="selection"
                    :prop="'collatorData.' + scope.$index + '.auditor'"
                    :rules="collatorForm.rules.auditor"
                  >
                    <el-input v-model="scope.row.auditor" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="auditor" label="批准人" width="160" v-if="isApprover">
                <template slot-scope="scope">
                  <el-form-item
                    type="selection"
                    :prop="'collatorData.' + scope.$index + '.approver'"
                    :rules="collatorForm.rules.approver"
                  >
                    <el-input v-model="scope.row.approver" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-col>
        <el-col :span="12">
          <span>科室人员列表</span>
          <el-table :data="peopleData" height="450" border class="peopleData">
            <el-table-column prop="userName" label="姓名" width="180" fixed></el-table-column>
            <el-table-column prop="ProjectOwnerCount" label="设总"></el-table-column>
            <el-table-column prop="ProfessionOwnerCount" label="主设"></el-table-column>
            <el-table-column prop="DesignerCount" label="设计"></el-table-column>
            <el-table-column prop="SenderCount" label="互提"></el-table-column>
            <el-table-column prop="CheckerCount" label="校核"></el-table-column>
            <el-table-column prop="AuditorCount" label="审核"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit('collatorForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import userAPI from "./api/services/user";
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
      isApprover: false,
      collatorForm: {
        collatorData: [
          {
            checker: "",
            auditor: "",
            approver: ""
          }
        ],
        rules: {
          checker: [
            { required: true, message: "校核人不能为空", trigger: "blur" }
          ],
          auditor: [
            { required: true, message: "审核人不能为空", trigger: "blur" }
          ],
          approver: [
            { required: true, message: "批准人不能为空", trigger: "blur" }
          ]
        }
      },
      peopleData: [
        {
          name: "",
          mainDesign: "",
          design: "",
          eachOther: "",
          proofread: "",
          audit: ""
        }
      ],
      formLabelWidth: "10%"
    };
  },
  methods: {
    dialogClose() {
      this.$emit("reData", false);
    },
    cancel() {
      this.$refs['collatorForm'].resetFields();
      this.dialogClose();
    },
    submit() {
      // this.$refs[formName].validate(valid => {
      // if (valid) {
      let workflowAttrJson = [];
      // 如果有批准人调用selectUserApprov，没有则调用selectUserEx
      if (this.isApprover) {
        this.collatorForm.collatorData.forEach(item => {
          workflowAttrJson.push({
            workflowKeyword: item.workflowKeyword,
            checker: item.checker,
            auditor: item.auditor,
            approver: item.approver
          });
        });
        userAPI.selectUserApprov(workflowAttrJson).then(res => {
          if (res.success) {
            this.cancel();
            this.$message({
              type: "success",
              message: "提交成功"
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
      } else {
        this.collatorForm.collatorData.forEach(item => {
          workflowAttrJson.push({
            workflowKeyword: item.workflowKeyword,
            checker: item.checker,
            auditor: item.auditor
          });
        });
        userAPI.selectUserEx(workflowAttrJson).then(res => {
          if (res.success) {
            this.cancel();
            this.$message({
              type: "success",
              message: "提交成功"
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
      }
      // }
      //  else {
      //   this.$message.error("请输入核校人员信息");
      //   return false;
      // }
      // });
    },
    // 选择校核审人员 —— 带批准人
    getSelectUserApprovDefault() {
      let WorkFlowKeyword = this.dialogObj.keyword;
      userAPI.getSelectUserApprovDefault(WorkFlowKeyword).then(res => {
        console.log(res);
        if (res.success) {
          this.collatorForm.collatorData = res.data[0].WorkflowList;
          this.peopleData = res.data[0].UserList;
          this.isApprover = true;
        }
      });
    },
    // 选择校核审人员 —— 不带批准人
    getSelectUserExDefault() {
      let WorkFlowKeyword = this.dialogObj.keyword;
      userAPI.getSelectUserExDefault(WorkFlowKeyword).then(res => {
        if (res.success) {
          this.collatorForm.collatorData = res.data[0].WorkflowList;
          this.peopleData = res.data[0].UserList;
        }
      });
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          if (newValue.FuncName === "selectUserEx") {
            this.getSelectUserExDefault();
          } else {
            this.getSelectUserApprovDefault();
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style lang="scss">
.collator {
  .cell {
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .collatorTable {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-input__inner {
      padding: 0;
      border: 1px solid #fff;
    }
    [data-v-71e54f9c] .el-table td {
      padding: 0;
    }
  }
  .peopleData {
    width: 100%;
  }
}
</style>