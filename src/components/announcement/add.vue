<template>
  <el-dialog
    title="新增公告"
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
          :isClear="isClear"
          :content="form.content"
          :isSubmit="isSubmit"
          @getHtml="getHtml"
        ></WangEditor>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { format } from "@/util/Time";
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
        if (newValue) {
          this.form = newValue;
        }
      },
      deep: true,
      immediate: true,
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
      vm.$refs.form.validate((valid) => {
        if (valid) {
          this.form.date = format(this.form.date, "yyyy-MM-dd");
          this.isSubmit = true;
          this.cancel();
        }
      });
    },
    cancel() {
      this.dialogObject.switch = false;
      this.isClear = true;
      this.$refs.form.resetFields();
      console.log(this.form);
    },
  },
};
</script>

<style>
</style>