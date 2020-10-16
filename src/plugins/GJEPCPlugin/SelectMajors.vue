<template>
  <div class="selectMajors">
    <el-form ref="form" :model="majorsForm" label-width="80px">
      <el-form-item label="设计阶段" prop="designStage">
        <el-select v-model="majorsForm.designStage" @change="stageChange" class="type2">
          <el-option v-for="(item, index) in majorList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <h5>请为该阶段选择专业:</h5>
      <el-checkbox-group v-model="typeList" class="majorCheckBox">
        <el-checkbox v-for="(item, index) in majorsForm.type" :key="index" :label="item">{{item}}</el-checkbox>
      </el-checkbox-group>
    </el-form>
    <span slot="footer" class="footerBtn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </div>
</template>
<script>
import perfessionAPI from "./api/services/profession";
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
      typeList: [],
      majorList: [],
      majorsForm: {
        designStage: "",
        type: []
      }
    };
  },
  methods: {
    dialogClose() {
      this.$emit("reData", false);
    },
    stageChange(e) {
      this.getDesignPhaseProfession(e);
    },
    cancel() {
      this.$refs["form"].resetFields();
      this.typeList = [];
      this.dialogClose();
    },
    // 提交
    submit() {
      let arr = [];
      for (let i = 0; i < this.majorsForm.type.length; i++) {
        if (this.typeList.indexOf(this.majorsForm.type[i]) != -1) {
          arr.push(this.majorsForm.type[i]);
        }
      }
      let prjoectKeyword = this.dialogObj.keyword,
        designPhase = this.majorsForm.designStage,
        professionList = arr.join(","),
        startAtWfBtn = this.dialogObj.startAtWfBtn;
      perfessionAPI
        .setProfession(
          prjoectKeyword,
          designPhase,
          professionList,
          startAtWfBtn
        )
        .then(res => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "提交成功"
            });
            this.cancel();
            this.getProjectPath()
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
    },
    // 获取专业列表
    getProfessionList() {
      perfessionAPI.getProfessionList().then(res => {
        if (res.success) {
          this.majorsForm.type = Object.values(res.data[0]);
          this.majorList = Object.values(res.data[1]);
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    // 获取已创建的专业，以及项目阶段(选取项目阶段目录时触发)
    getCreatedProfession() {
      let ProjectKeyword = this.dialogObj.keyword;
      perfessionAPI.getCreatedProfession(ProjectKeyword).then(res => {
        if (res.success) {
          this.majorsForm.designStage = res.data[0].DesignPhase;
          this.typeList = res.data[0].CreatedProfession.split(",");
        } else {
          this.$message({ message: res.msg, type: "error" });
        }
      });
    },
    // 获取已创建的专业，以及项目阶段(选取项目根目录时触发)
    getDesignPhaseProfession(phase) {
      let ProjectKeyword = this.dialogObj.keyword,
        DesignPhaseCode = phase;
      perfessionAPI
        .getDesignPhaseProfession(ProjectKeyword, DesignPhaseCode)
        .then(res => {
          if (res.success) {
            this.majorsForm.designStage = res.data[0].DesignPhase;
            this.typeList = res.data[0].CreatedProfession.split(",");
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
      await proAPI.saveLastProject(this.dialogObj.keyword)
      this.$store.commit("project/REFRESH_TREE", true)
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getProfessionList();
          this.getCreatedProfession();
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
<style lang="scss">
.selectMajors {
  .el-form-item__label {
    font-size: 12px;
    width: 120px !important;
    text-align: left;
  }
  input {
    height: 36px;
  }
}
.majorCheckBox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .el-checkbox {
    width: 50%;
    height: 30px;
    margin-right: 0;
  }
}
.type2 {
  pointer-events: none;
  .el-input__suffix-inner {
    pointer-events: none;
  }
}
</style>
