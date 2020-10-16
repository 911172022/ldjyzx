<template>
  <div>
    <el-dialog
      title="选择分发专业"
      :visible.sync="dialogObj.switch"
      width="25%"
      :before-close="dialogClose"
    >
      <el-form :model="MajorsForm" ref="MajorsForm">
        <el-form-item label="请为该文件选择分发的专业：" class="checkBox">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in MajorsForm.list"
              :key="index"
              :value="index"
              :label="index"
            >{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="处理意见">
          <el-input type="textarea" v-model="MajorsForm.desc" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import docAPI from "./api/services/doc";
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
      checkList: [],
      MajorsForm: {
        desc: "",
        list: []
      }
    };
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getProfessionList();
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    dialogClose() {
      this.$emit("reData", false);
    },
    cancel() {
      this.dialogClose();
      this.checkList = [];
      this.MajorsForm.desc = ''
    },
    submit() {
      let professionList = this.checkList.join(","),
        WorkFlowKeyword = this.dialogObj.keyword;
      docAPI
        .setReceiveDocProfession(WorkFlowKeyword, professionList)
        .then(res => {
          if (res.success) {
            this.cancel();
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
    },
    getProfessionList() {

      let WorkFlowKeyword = this.dialogObj.keyword;
      docAPI.getProfessionList(WorkFlowKeyword).then(res => {
        console.log(res)
        if (res.success) {
          this.MajorsForm.list = res.data[0];
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.checkBox {
  display: flex;
  flex-direction: column;
  .el-form-item__label {
    text-align: left;
  }
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
  }
  .el-checkbox {
    width: 150px;
    margin-right: 0;
  }
}
</style>
