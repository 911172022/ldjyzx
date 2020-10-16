<template>
  <div>
    <el-dialog
      title="项目立项"
      :visible.sync="dialogObj.switch"
      width="50%"
      :before-close="dialogClose"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="120px" class="projectForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目编号" prop="projectNum">
              <el-input v-model="form.projectNum"></el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form.projectName"></el-input>
            </el-form-item>
            <el-form-item label="建设单位" prop="unitName">
              <el-input v-model="form.unitName"></el-input>
            </el-form-item>
            <el-form-item label="设计阶段" prop="designStage">
              <el-select v-model="form.designStage" placeholder="请选择设计阶段">
                <el-option
                  v-for="item in DesignPhase"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设计依据" prop="gist">
              <el-input v-model="form.gist"></el-input>
            </el-form-item>
            <el-form-item label="主要设计原则" prop="tenet">
              <el-input v-model="form.tenet"></el-input>
            </el-form-item>
            <el-form-item label="甲方联络人" prop="liaison">
              <el-input v-model="form.liaison"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="人力资源" prop="hr">
              <el-input v-model="form.hr"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同号" prop="contractNum">
              <el-input v-model="form.contractNum"></el-input>
            </el-form-item>
            <el-form-item label="合同额" prop="contractAmount">
              <el-input v-model="form.contractAmount"></el-input>
            </el-form-item>
            <el-form-item label="合同模式" prop="contractType">
              <el-select v-model="form.contractType" placeholder="请选择合同模式">
                <el-option
                  v-for="item in ContractModel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目规模" prop="size">
              <el-input v-model="form.size"></el-input>
            </el-form-item>
            <el-form-item label="立项人" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="文本编辑规定" prop="rule">
              <el-input v-model="form.rule"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划下达时间" prop="date">
              <el-date-picker type="date" v-model="form.date" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="计划开始时间" prop="startDate">
              <el-date-picker type="date" v-model="form.startDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="计划结束时间" prop="endDate">
              <el-date-picker type="date" v-model="form.endDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="项目开发阶段" prop="projectStage">
              <el-select v-model="form.projectStage">
                <el-option
                  v-for="item in DevelopmentPhase"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="质量目标" prop="target">
              <el-select v-model="form.target">
                <el-option label="省优秀" value="省优秀"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工程实施性质" prop="nature">
              <el-select v-model="form.nature">
                <el-option
                  v-for="item in EngineeringProperties"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="项目类型" class="projectType" prop="type">
              <el-select v-model="form.type" @change="projectTypeChange">
                <el-option
                  v-for="item in ProjectType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="form.type2" class="type2">
                <el-option
                  v-for="item in projectType2Options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目特殊要求" prop="specialReq">
              <el-input type="textarea" :autosize="textareaSize" v-model="form.specialReq"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程总结" prop="summary">
              <el-input type="textarea" :autosize="textareaSize" v-model="form.summary"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合同主要条款" prop="mainClause">
              <el-input type="textarea" :autosize="textareaSize" v-model="form.mainClause"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="projectSubmit('form')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import projectAPI from "./api/services/project";
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
      textareaSize: {
        minRows: 4
      },
      DesignPhase: [
        { value: "A__初步可行性研究", label: "A__初步可行性研究" },
        { value: "B__可行性研究", label: "B__可行性研究" },
        { value: "C__初步设计", label: "C__初步设计" },
        { value: "D__施工图设计", label: "D__施工图设计" },
        { value: "E__施工图配合", label: "E__施工图配合" },
        { value: "F__竣工图", label: "F__竣工图" },
        { value: "G__设计回访总结", label: "G__设计回访总结" },
        { value: "H__投标设计", label: "H__投标设计" },
        { value: "I__技术方案设计书", label: "I__技术方案设计书" },
        { value: "J__设计管理", label: "J__设计管理" },
        { value: "K__研发设计", label: "K__研发设计" }
      ],
      DevelopmentPhase: [
        { value: "前期决策阶段", label: "前期决策阶段" },
        { value: "实施阶段", label: "实施阶段" },
        { value: "运营阶段", label: "运营阶段" },
        { value: "准备阶段", label: "准备阶段" }
      ],
      ProjectType: [
        { value: "发电工程", label: "发电工程" },
        { value: "环保工程", label: "环保工程" },
        { value: "其它工程", label: "其它工程" },
        { value: "热力工程", label: "热力工程" }
      ],
      projectType2Options: [
        { value: "燃煤发电", label: "燃煤发电" },
        { value: "脱硫项目", label: "脱硫项目" },
        { value: "公共设施项目", label: "公共设施项目" },
        { value: "锅炉岛项目", label: "锅炉岛项目" }
      ],
      EngineeringProperties: [
        { value: "改造", label: "改造" },
        { value: "扩建", label: "扩建" },
        { value: "其他", label: "其他" },
        { value: "新建", label: "新建" }
      ],
      ContractModel: [
        { value: "BOO", label: "BOO" },
        { value: "BOT", label: "BOT" },
        { value: "C", label: "C" },
        { value: "E", label: "E" },
        { value: "EP", label: "EP" },
        { value: "EPC", label: "EPC" },
        { value: "EPCM", label: "EPCM" },
        { value: "P", label: "P" },
        { value: "PC", label: "PPP" },
        { value: "其它", label: "其它" }
      ],
      form: {
        projectNum: "",
        projectName: "",
        unitName: "",
        designStage: "A__初步可行性研究",
        gist: "",
        liaison: "",
        phone: "",
        tenet: "",
        hr: "",
        date: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        contractAmount: "",
        contractNum: "",
        contractType: "BOO",
        size: "",
        name: "",
        rule: "",
        type: "发电工程",
        type2: "燃煤发电",
        projectStage: "前期决策阶段",
        target: "省优秀",
        nature: "改造",
        specialReq: "",
        summary: "",
        mainClause: ""
      },
      rules: {
        projectNum: [
          { required: true, message: "请输入项目编号", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        unitName: [
          { required: true, message: "请选择建设单位", trigger: "blur" }
        ],
        designStage: [
          { required: true, message: "请选择设计阶段", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 关闭弹窗
    dialogClose() {
      this.$emit("reData", false);
    },
    projectSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let projectAttrJson = [
            { name: "projectCode", value: this.form.projectNum },
            { name: "projectDesc", value: this.form.projectName },
            { name: "unintName", value: this.form.unitName },
            { name: "designPhase", value: this.form.designStage },
            { name: "HUMAN", value: this.form.hr },
            { name: "PROJECTNOMBER", value: this.form.contractNum },
            { name: "projectAmount", value: this.form.contractAmount },
            { name: "contractModel", value: this.form.contractType },
            { name: "projectSize", value: this.form.size },
            { name: "writeMan", value: this.form.name },
            { name: "TEXTEDITING", value: this.form.rule },
            { name: "projectType", value: this.form.type },
            { name: "projectTypeR", value: this.form.type2 },
            { name: "DESIGNPRINCIPLES", value: this.form.tenet },
            { name: "unitMan", value: this.form.liaison },
            { name: "unitManPhone", value: this.form.phone },
            { name: "releaseDate", value: this.form.date },
            { name: "planStartDate", value: this.form.startDate },
            { name: "planEndDate", value: this.form.endDate },
            { name: "developmentPhase", value: this.form.projectStage },
            { name: "quality", value: this.form.target },
            { name: "CONSTRUCTIONNATURE", value: this.form.nature },
            { name: "projectSummary", value: this.form.summary },
            { name: "Requirement", value: this.form.specialReq },
            { name: "contractTerms", value: this.form.mainClause },
            { name: "designScope", value: this.form.gist }
          ];
          let attrJson = JSON.stringify(projectAttrJson);
          projectAPI.createRootProject(attrJson).then(res => {
            if (res.success) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.startNewWorkFlow(res.data[0].projectKeyword);
              this.getProjectPath(res.data[0].projectKeyword);
              this.cancel();
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
    // 项目类型 第一个select改变值后，另一个select也随之改变
    projectTypeChange(value) {
      for (let i = 0; i < this.ProjectType.length; i++) {
        if (this.ProjectType[i].value == value) {
          this.form.type2 = this.projectType2Options[i].label;
        }
      }
    },
    cancel() {
      this.$refs["form"].resetFields();
      this.dialogClose();
    },
    // 启动流程
    startNewWorkFlow(keyword) {
      let DocList = keyword,
        WfKeyword = "CREATEPROJECT",
        userlist = "";
      projectAPI.startNewWorkFlow(DocList, WfKeyword, userlist).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "流程启动成功"
          });
        } else {
          this.$message({
            type: "error",
            message: "流程启动失败"
          });
        }
      });
    },
    // 开启位置
    async getProjectPath(projectKeyword) {
      //  储存位置
      await proAPI.saveLastProject(projectKeyword);
      this.$store.commit("project/REFRESH_TREE", true);
    }
  }
};
</script>
<style lang="scss">
.projectForm {
  .el-select {
    width: 100%;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .projectType {
    .el-form-item__content {
      display: flex;
      flex-direction: row;
      .el-select:last-child {
        margin-left: 15%;
      }
    }
  }
  .el-form-item__error {
    left: 10px;
  }
  .type2 {
    pointer-events: none;
    .el-input__suffix-inner {
      pointer-events: none;
    }
  }
}
</style>