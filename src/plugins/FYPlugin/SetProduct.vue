<template>
  <div class="setProduct">
      <el-form :model="setProduct" ref="setProduct">
        <el-form-item label="成品编码" prop="projectCode">
          <el-input v-model="setProduct.projectCode" />
        </el-form-item>
        <el-form-item label="产品描述" prop="projectDesc">
          <el-input v-model="setProduct.projectDesc" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerBtn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
  </div>
</template>
<script>
import prodectAPI from "./api/services/prodect";
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
      formLabelWidth: "10%",
      setProduct: {
        projectCode: "",
        projectDesc: ""
      }
    };
  },
  methods: {
    dialogClose() {
      this.$emit("reData", false);
    },
    submit() {
      let ProjectKeyword = this.dialogObj.projectId,
        projectAttrJson = [
          { name: "projectCode", value: this.setProduct.projectCode },
          { name: "projectDesc", value: this.setProduct.projectDesc }
        ];
      prodectAPI.createProdect(ProjectKeyword, projectAttrJson).then(res => {
        if (res.success) {
          this.cancel();
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.getProjectPath()
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    cancel() {
      this.dialogClose();
      this.$refs["setProduct"].resetFields();
    },
    // 上次开启位置
    async getProjectPath() {
      //  储存位置
      await proAPI.saveLastProject(this.dialogObj.projectId)
      this.$store.commit("project/REFRESH_TREE", true)
    },
  }
};
</script>
<style lang="scss" scope>
.setProduct {
  .el-input {
    width: 80%;
  }
}
</style>