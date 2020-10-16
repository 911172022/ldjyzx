<template>
  <div>
    <el-dialog
      title="选择会签专业"
      :visible.sync="dialogObj.switch"
      width="30%"
      :before-close="dialogClose"
      class="contract"
    >
      <el-form :model="contract" ref="contract">
        <el-form-item label="会签专业" prop="checkList">
          <el-checkbox-group v-model="checkList" @change="changeCheck">
            <el-checkbox
              v-for="item in contract.list"
              :key="item.ProjectKeyword"
              :value="item.ProjectKeyword"
              :label="item.Pression"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="会签人" prop="contractMan">
          <el-input v-model="contractMan" placeholder="请确保会签专业已选择主设人" readonly />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancel">不会签</el-button>
        <el-button @click="submit">会签</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import prodectAPI from "./api/services/prodect";
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
      contract: {
        list: []
      },
      contractMan: "",
      checkList: []
    };
  },
  methods: {
    dialogClose() {
      this.$emit("reData", false);
    },
    changeCheck(e) {
      let vm = this,
        pression = vm.contract.list,
        arr = [];
      vm.contractMan = "";
      for (let i = 0; i < pression.length; i++) {
        if (e.indexOf(pression[i].Pression) != -1 && pression[i].OwnerUser) {
          arr.push(pression[i].OwnerUser);
          vm.contractMan = arr.join(",");
        }
      }
      this.$forceUpdate();
    },
    cancel() {
      this.dialogClose();
      this.checkList = [];
      this.contractMan = "";
      this.contract = {};
    },
    submit() {
      let arr = [],
        Receiver = this.contractMan;
      this.dialogObj.docKeyWord.forEach(item => {
        arr.push(item.Keyword);
      });
      let DocKeyword = arr.toString();
      prodectAPI.setProdectSignProfession(DocKeyword, Receiver).then(res => {
        if (res.success) {
          this.cancel();
          this.$message({
            message: "会签成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    getProductSignDefault() {
      let arr = [];
      this.dialogObj.docKeyWord.forEach(item => {
        arr.push(item.Keyword);
      });
      let DocKeyword = arr.join(",");
      prodectAPI.getProductSignDefault(DocKeyword).then(res => {
        if (res.success) {
          this.contract.list = res.data[0].PressionList;
        }
      });
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getProductSignDefault();
        } else {
          return;
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style lang="scss" scope>
.contract {
  .el-form-item {
    display: flex;
    .el-form-item__label {
      flex: 1;
    }
    .el-form-item__content {
      flex: 4.7;
    }
  }
}
</style>