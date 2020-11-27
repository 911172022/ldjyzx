<template>
  <el-dialog
    :title="dialogObject.title"
    :close-on-click-modal="false"
    :visible.sync="dialogObject.switch"
    width="70%"
    :before-close="handleClose"
    append-to-body
  >
    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="form.date" type="date" placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <WangEditor
          v-if="dialogObject.switch"
          :isClear="isClear"
          :content="form.content"
          :isSubmit="isSubmit"
          @getHtml="getHtml"
        ></WangEditor>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">{{
        dialogObject.title == "添加" ? "确定" : "修改"
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { format } from "@/util/Time";
import ReportApi from "@/api/services2/announcement";
export default {
  props: {
    dialogObject: {
      type: Object,
      default: () => ({
        switch: false,
      }),
    },
    formData: Object,
  },
  data() {
    return {
      isSubmit: false,
      isClear: false,
      form: {
        date: "",
        title: "",
        content: "",
      },
    };
  },
  watch: {
    formData: {
      handler(newValue) {
        if(newValue.isEdit) {
          this.form = {
            date: newValue.date,
            title: newValue.title,
            content: newValue.content
          }
        }
      },
      deep: true,
      immediate:true
    },
    dialogObject: {
      handler(newValue) {
        this.isSubmit = false;
        this.isClear = false;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getHtml(e) {
      this.form.content = e;
    },
    handleClose() {
      this.cancel();
    },
    submit() {
      let vm = this;
      this.isSubmit = true;
      this.getHtml();
      setTimeout(() => {
        // vm.$refs.form.validate((valid) => {
        // if (valid) {
        this.form.date = format(this.form.date, "yyyy-MM-dd");
        if (this.dialogObject.title == "添加") {
          let data = {
            time: this.form.date,
            title: this.form.title,
            content: this.form.content,
          };
          ReportApi.addReport(data).then((res) => {
            if (res.code === 200) {
              this.$message.success("提交成功");
              this.cancel();
            }
          });
        }
        if (this.dialogObject.title == "修改") {
          let data = {
            announcementId: this.dialogObject.announcementId,
            time: this.form.date,
            title: this.form.title,
            content: this.form.content,
          };
          ReportApi.editReport(data).then((res) => {
            if (res.code === 200) {
              this.$message.success("修改成功");
              this.cancel();
            }
          });
        }
        // }
        // });
      });
    },
    cancel() {
      this.$emit("cancel", false);
      this.isClear = true;
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style>
</style>