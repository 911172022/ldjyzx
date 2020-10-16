<template>
  <div class="setWork">
    <el-form :model="workForm" ref="workForm">
      <el-form-item label="工作任务名称" prop="name">
        <el-input v-model="workForm.name" />
      </el-form-item>
      <el-form-item label="工作任务内容" prop="content">
        <el-input :autosize="size" type="textarea" v-model="workForm.content" />
      </el-form-item>
      <!-- <el-form-item label="责任人" class="dutyMan" prop="dutyMan">
          <el-input v-model="workForm.dutyMan" readonly />
          <el-button type="primary" @click="openPermission">选择</el-button>
      </el-form-item>-->
      <el-form-item label="工作开始时间" prop="stratDate">
        <el-date-picker
          v-model="workForm.stratDate"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          placeholder="开始日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="工作结束时间" prop="endDate">
        <el-date-picker
          v-model="workForm.endDate"
          type="date"
          format="yyyy 年 MM 月 dd 日"
          placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footerBtn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
    <PermissionList :dialogObj="PermissionData" @reData="rePerList" @reUser="reUser(arguments)" />
  </div>
</template>
<script>
import workAPI from "./api/services/work";
import PermissionList from "../../components/Dialog/PermissionList-PM2";
import UserApi from "../../api/services/workflow";
import proAPI from "../../api/services/project";

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
      PermissionData: {
        switch: false
      },
      size: {
        minRows: 4
      },
      formLabelWidth: "10%",
      workForm: {
        name: "",
        content: "",
        dutyMan: "",
        stratDate: new Date(),
        endDate: new Date()
      }
    };
  },
  components: { PermissionList },
  methods: {
    // 开关用户弹窗
    openPermission() {
      this.PermissionData.switch = true;
    },
    rePerList(e) {
      this.PermissionData.switch = e;
    },
    dialogClose() {
      this.$emit("reData", false);
    },
    submit() {
      let ProjectKeyword = this.dialogObj.projectId,
        docAttrJson = [
          { name: "taskName", value: this.workForm.name },
          { name: "taskContent", value: this.workForm.content },
          { name: "taskStartDate", value: this.workForm.stratDate },
          { name: "taskEndDate", value: this.workForm.endDate }
        ];
      workAPI.createTask(ProjectKeyword, docAttrJson).then(res => {
        if (res.success) {
          this.cancel();
          this.$message({
            type: "success",
            message: "提交成功"
          });
          this.getProjectPath()
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    },
    reUser(e) {
      console.log(e);
      this.workForm.dutyMan = e[1];
    },
    cancel() {
      this.$refs["workForm"].resetFields();
      this.dialogClose();
    },
    // 上次开启位置
    async getProjectPath() {
      //  储存位置
      await proAPI.saveLastProject(this.dialogObj.projectId)
      this.$store.commit("project/REFRESH_TREE", true)
    }
  }
};
</script>
<style lang="scss" scope>
.setWork {
  .el-form-item__label {
    font-size: 12px;
    width: 100px;
  }
  .el-input,
  .el-textarea,
  .el-range-editor {
    width: 100%;
  }
  .dutyMan {
    .el-form-item__content {
      display: flex;
      .el-input {
        width: 79%;
        margin-right: 15px;
      }
    }
  }
}
</style>
<style lang="scss">
  .footerBtn {
    display: inline-block;
    text-align: right;
    width: 100%;
    padding: 20px 0 0 0;
  }
</style>