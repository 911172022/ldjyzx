<template>
  <div>
    <el-dialog
      title="填报工时"
      :visible.sync="dialogObj.switch"
      width="60%"
      :before-close="dialogClose"
      class="workTime"
    >
      <el-row :gutter="40">
        <el-col :span="6">
          <div style="margin-bottom: 10px;">任务列表</div>
          <div
            v-if="inputVisible && taskName.length > 0"
            class="radioBox"
            style="position: relative; height: 760px; border: 1px solid #ddd;"
          >
            <el-scrollbar style="height:100%;" class="scrollbar">
              <el-radio-group @change="handleRadio" v-model="taskRadio" class="radio">
                <el-radio
                  v-for="item in taskName"
                  :key="item.taskKeyword"
                  :label="item.taskKeyword"
                  :value="item.taskName"
                  :title="item.taskName"
                >{{item.taskName}}</el-radio>
              </el-radio-group>
            </el-scrollbar>
            <!-- <div class="taskBtn">
              <div class="btnDot" id="task">···</div>
              <div class="btnDel" v-show="taskDel" @click="deleteTaskReport">删除</div>
            </div> -->
          </div>
          <el-button v-if="inputVisible" class="buttonShow" size="small" @click="showForm">+ 新建任务</el-button>
          <el-form v-else :model="createTask" ref="createTask" class="task">
            <el-form-item prop="title">
              <el-input
                class="inputShow"
                v-model="createTask.title"
                ref="saveTitleInput"
                size="small"
              />
            </el-form-item>
            <!-- <el-form-item label="设计人" prop="tags">
              <el-tag
                :key="item.id"
                v-for="item in createTask.tags"
                closable
                @close="tagHandleClose(item)"
              >{{item.name}}</el-tag>
              <el-button
                type="primary"
                size="medium"
                style="width: 100%;"
                @click="openPerList"
              >选择设计人</el-button>
            </el-form-item>-->
            <el-form-item label="任务开始时间" prop="startDate">
              <el-date-picker
                v-model="createTask.startDate"
                type="date"
                placeholder="请选择时间"
                format="yyyy 年 MM 月 dd 日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="任务结束时间" prop="endDate">
              <el-date-picker
                v-model="createTask.endDate"
                type="date"
                placeholder="请选择时间"
                format="yyyy 年 MM 月 dd 日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="任务内容" prop="content">
              <el-input v-model="createTask.content" type="textarea" :autosize="size" />
            </el-form-item>
            <div class="btnBox">
              <el-button @click="reset">取消</el-button>
              <el-button type="primary" @click="submit">创建</el-button>
            </div>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div v-if="inputVisible">
            <div style="margin-bottom: 10px;">任务报告</div>
            <div class="radioBox" v-if="reportName.length > 0">
              <el-scrollbar style="height:100%;" class="scrollbar">
                <el-radio-group
                  @change="handleReportRadio"
                  v-model="reportRadio"
                  class="reportRadio"
                >
                  <el-radio
                    v-for="item in reportName"
                    :key="item.reportKeyword"
                    :label="item.reportKeyword"
                    :title="item.reportContent"
                  >{{item.reportContent}}</el-radio>
                </el-radio-group>
              </el-scrollbar>
              <div class="taskBtn">
                <div class="btnDot" id="report">···</div>
                <div class="btnDel" v-show="reportDel" @click="deleteTaskReport">删除</div>
              </div>
            </div>
            <el-button class="buttonShow" size="small" @click="newReport">+ 新建报告</el-button>
          </div>
        </el-col>
        <el-col :span="12" style="border-left: 1px solid #DDD;">
          <el-form :model="workTimeForm" ref="workTimeForm">
            <!-- <el-form-item label="任务名称" prop="name">
              <el-input v-model="workTimeForm.name" :disabled="disabled" />
            </el-form-item>-->
            <el-form-item label="报告内容" prop="reportContent">
              <el-input
                type="textarea"
                :autosize="size"
                v-model="workTimeForm.reportContent"
                :disabled="disabled"
              />
            </el-form-item>
            <el-form-item label="存在问题" prop="reportProblom">
              <el-input
                type="textarea"
                :autosize="size"
                v-model="workTimeForm.reportProblom"
                :disabled="disabled"
              />
            </el-form-item>
            <el-form-item label="任务完成情况" prop="schedule">
              <el-input v-model="workTimeForm.schedule" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="报告时间" prop="reportDate">
              <el-date-picker v-model="workTimeForm.reportDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="起始时间" prop="startDate">
              <el-date-picker v-model="workTimeForm.startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="报告截至时间" prop="endDate">
              <el-date-picker v-model="workTimeForm.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="正常上班时间" prop="normalDate">
              <el-date-picker
                v-model="normalDate"
                type="datetimerange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['9:00:00', '18:00:00']"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="加班时间" prop="overTimeDate">
              <el-date-picker
                v-model="overTimeDate"
                @change="overTime"
                type="datetimerange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['9:00:00', '18:00:00']"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="实际工时" prop="laborTime">
              <el-input v-model="workTimeForm.laborTime" readonly />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitAll">保存修改</el-button>
      </span>
    </el-dialog>
    <PermissionList
      :dialogObj="PermissionListData"
      @reData="rePerList"
      @reUser="reUser(arguments)"
    />
  </div>
</template>
<script>
import workAPI from "./api/services/work";
import PermissionList from "../../components/Dialog/PermissionList-PM2";
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
  components: { PermissionList },
  data() {
    return {
      disabled: true,
      size: {
        minRows: 4
      },
      PermissionListData: {
        switch: false
      },
      // 任务列表
      taskName: [],
      taskRadio: "",
      // 任务报告列表
      reportName: [],
      reportRadio: "",
      formLabelWidth: "10%",
      createTask: {
        title: "",
        tags: [],
        startDate: new Date(),
        endDate: new Date(),
        content: ""
      },
      workTimeForm: {
        name: "",
        reportContent: "",
        reportProblom: "",
        schedule: "",
        reportDate: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        laborTime: ""
      },
      normalDate: "",
      overTimeDate: "",
      inputVisible: true, //显示新建任务form表单
      taskDel: false,
      reportDel: false
    };
  },
  methods: {
    openPerList() {
      this.PermissionListData.switch = true;
    },
    reUser(e) {
      this.createTask.tags.push({
        id: e[2],
        name: e[1]
      });
    },
    rePerList(e) {
      this.PermissionListData.switch = e;
    },
    dialogClose() {
      this.$emit("reData", false);
    },
    // 计算实时工时
    overTime(e) {
      this.workTimeForm.laborTime = "";
      let time = new Date(e[1]).getTime() - new Date(e[0]).getTime();
      this.workTimeForm.laborTime = time / 1000 / 60 / 60;
      this.workTimeForm.laborTime.toFixed(2);
    },
    // 新建任务报告
    newReport() {
      this.disabled = false;
      this.reportRadio = [];
      this.normalDate = "";
      this.overTimeDate = "";
      this.$refs["workTimeForm"].resetFields();
    },
    //新建任务提交
    submit() {
      let arr = [];
      this.createTask.tags.forEach(item => {
        arr.push(item.id);
      });
      let UserKeyWord = arr.join(","),
        docAttrJson = [
          { name: "taskName", value: this.createTask.title },
          { name: "taskContent", value: this.createTask.content },
          { name: "taskStartDate", value: this.createTask.startDate },
          { name: "taskEndDate", value: this.createTask.endDate }
        ];
      workAPI.createUserTask(UserKeyWord, docAttrJson).then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "新建任务成功"
          });
          this.reset();
          this.getTaskReportDefault();
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    },
    //保存修改提交
    submitAll() {
      if (this.reportRadio.length > 0) {
        let ReportKeyword = this.reportRadio,
          reportAttrJson = [
            { name: "content", value: this.workTimeForm.reportContent },
            { name: "problom", value: this.workTimeForm.reportProblom },
            { name: "schedule", value: this.workTimeForm.schedule },
            { name: "laborTime", value: this.workTimeForm.laborTime },
            { name: "reportDate", value: this.workTimeForm.reportDate },
            { name: "startDate", value: this.workTimeForm.startDate },
            { name: "endDate", value: this.workTimeForm.endDate }
          ];
        workAPI.modiTaskReport(ReportKeyword, reportAttrJson).then(res => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.cancel();
          } else {
            this.$message({
              type: "reportProblom",
              message: res.msg
            });
          }
        });
      } else {
        let TaskKeyWord = this.taskRadio,
          reportAttrJson = [
            { name: "content", value: this.workTimeForm.reportContent },
            { name: "problom", value: this.workTimeForm.reportProblom },
            { name: "schedule", value: this.workTimeForm.schedule },
            { name: "laborTime", value: this.workTimeForm.laborTime },
            { name: "reportDate", value: this.workTimeForm.reportDate },
            { name: "startDate", value: this.workTimeForm.startDate },
            { name: "endDate", value: this.workTimeForm.endDate }
          ];
        workAPI.createTaskReport(TaskKeyWord, reportAttrJson).then(res => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "提交成功"
            });
            this.cancel();
          } else {
            this.$message({
              type: "reportProblom",
              message: res.msg
            });
          }
        });
      }
    },
    tagHandleClose(e) {
      this.createTask.tags.splice(this.createTask.tags.indexOf(e), 1);
    },
    // 显示新建任务表单
    showForm() {
      this.inputVisible = false;
      this.$nextTick(() => {
        this.$refs.saveTitleInput.$refs.input.focus();
      });
    },
    // 任务列表选中时获取任务报告
    handleRadio(e) {
      if (e) {
        this.getTaskReportList();
        this.disabled = true;
        this.$refs["workTimeForm"].resetFields();
        this.reportRadio = "";
      }
    },
    // 任务报告选中时获取任务报告内容
    handleReportRadio(e) {
      this.disabled = false;
      this.getTaskReport();
      this.workTimeForm.name = e;
      this.normalDate = "";
      this.overTimeDate = "";
    },
    reset() {
      this.$refs["createTask"].resetFields();
      this.inputVisible = true;
    },
    cancel() {
      this.disabled = true;
      this.$refs["workTimeForm"].resetFields();
      this.normalDate = "";
      this.overTimeDate = "";
      this.reportName = [];
      this.taskRadio = "";
      this.reportRadio = "";
      this.dialogClose();
    },
    // 获取任务报告表单的默认参数
    getTaskReportDefault() {
      workAPI.getTaskReportDefault().then(res => {
        if (res.success) {
          this.taskName = res.data[0].taskList;
        } else {
          console.log("任务报告表单的默认参数获取失败" + res.msg);
        }
      });
    },
    // 获取任务报告内容
    getTaskReport() {
      let ReportKeyword = this.reportRadio;
      workAPI.getTaskReport(ReportKeyword).then(res => {
        if (res.success) {
          this.workTimeForm = res.data[0];
        } else {
          console.log("任务报告内容获取失败" + res.msg);
        }
      });
    },
    //获取任务的报告列表
    getTaskReportList() {
      let TaskKeyword = this.taskRadio;
      workAPI.getTaskReportList(TaskKeyword).then(res => {
        if (res.success) {
          this.reportName = res.data[0].reportList;
        } else {
          console.log("任务报告列表获取失败" + res.msg);
        }
      });
    },
    // 删除任务报告
    deleteTaskReport() {
      let ReportKeyword = this.reportRadio;
      this.$confirm("此操作将永久删除该报告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          workAPI.deleteTaskReport(ReportKeyword).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.$refs["workTimeForm"].resetFields();
              this.getTaskReportList();
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getTaskReportDefault();
          document.addEventListener("click", e => {
            if (e.target.id == "task") {
              this.taskDel = true;
              this.reportDel = false;
            } else if (e.target.id == "report") {
              this.taskDel = false;
              this.reportDel = true;
            } else {
              this.taskDel = false;
              this.reportDel = false;
            }
          });
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style lang="scss" scope>
.workTime {
  .el-form-item__label {
    font-size: 12px;
  }
  .el-date-editor,
  .el-select {
    width: 100%;
  }
  .el-dialog__body {
    padding: 0 20px;
  }
  .el-col {
    padding: 25px 20px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .buttonShow {
    width: 100%;
    height: 32px;
    line-height: 30px;
    text-align: left;
    padding-top: 0;
    padding-bottom: 0;
    color: #528ffd;
  }
  .inputShow {
    width: 100%;
    vertical-align: bottom;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .task {
    width: 360px;
    margin: 10px auto;
    padding: 20px;
    box-shadow: 1px 1px 10px #ddd;
    .btnBox {
      text-align: right;
      padding-top: 20px;
    }
  }
  .radioBox {
    position: relative;
    max-height: 760px;
    border: 1px solid #ddd;
    border-radius: 5px 5px 0 0;
  }
  .radio,
  .reportRadio {
    display: flex;
    flex-direction: column;
    // border: 1px solid #ddd;
    // border-radius: 5px 5px 0 0;
    padding: 9px 15px;
    border-bottom: none;
    .el-radio {
      line-height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .taskBtn {
    position: absolute;
    right: 6px;
    top: 12px;
    font-size: 12px;
    width: 40px;
    .btnDot {
      font-size: 20px;
      color: #aaa;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #528ffd;
      }
    }
    .btnDel {
      border: 1px solid #ccc;
      box-shadow: 1px 1px 10px #ddd;
      padding: 5px;
      background-color: #fff;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        color: #fff;
        background-color: #528ffd;
      }
    }
  }
  .noReport {
    text-align: center;
    line-height: 60px;
    color: #bbb;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>