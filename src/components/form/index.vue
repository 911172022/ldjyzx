<template>
  <div>
    <el-form :model="form" ref="form" :rules="rules" :label-width="labelWidth">
      <div v-for="(item, index) in formDataList" :key="index">
        <el-form-item
          :label="item.textName"
          :prop="item.textKey"
          v-if="item.textType === 'input'"
        >
          <el-input v-model="item.textValue" placeholder="请输入" />
        </el-form-item>
        <el-form-item
          :label="item.textName"
          :prop="item.textKey"
          v-else-if="item.textType === 'select'"
        >
          <el-select placeholder="请选择" v-model="item.textValue">
            <el-option
              v-for="(item, index) in item.options"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="item.textName"
          :prop="item.textKey"
          v-else-if="item.textType === 'date'"
        >
          <el-date-picker v-model="item.textValue" type="date" placeholder="请选择">
          </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { format } from "@/util/Time.js";
export default {
  props: {
    labelWidth: {
      type: String,
      default: "100px",
    },
  },
  data() {
    return {
      formDataList: [
        {
          textName: "标题",
          textKey: "title",
          textType: "input",
          required: false,
          textValue: "",
        },
        {
          textName: "月份",
          textKey: "month",
          textType: "select",
          textValue: "",
          options: [
            { value: 1, label: "一月" },
            { value: 2, label: "二月" },
            { value: 3, label: "三月" },
          ],
          required: false,
        },
        {
          textName: "姓名",
          textKey: "name",
          textType: "input",
          required: false,
          textValue: "",
        },
        {
          textName: "年龄",
          textKey: "age",
          textType: "input",
          required: false,
          textValue: "",
        },
        {
          textName: "性别",
          textKey: "sex",
          textType: "select",
          options: [
            { value: 0, label: "男" },
            { value: 1, label: "女" },
          ],
          required: false,
          textValue: "",
        },
        {
          textName: "出生年月",
          textKey: "date",
          textType: "date",
          required: true,
          textValue: "1997-06-09",
        },
      ],
    };
  },
  methods: {
    submit() {
      let vm = this;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form);
        }
      });
    },
  },
  computed: {
    form() {
      let form = {};
      this.formDataList.forEach((item, index) => {
        if (item.textType === "date") {
          let date = format(item.value, "yyyy-MM-dd");
          form[item.textKey] = date;
          console.log(date);
        } else {
          form[item.textKey] = item.value;
        }
      });
      return form;
    },
    rules() {
      let rules = {};
      this.formDataList.forEach((item, index) => {
        if (item.required) {
          switch (item.textType) {
            case "input":
              rules[item.textKey] = [
                {
                  required: true,
                  message: `请输入${item.textName}`,
                  trigger: "blur",
                },
              ];
              break;
            case "select":
              rules[item.textKey] = [
                {
                  required: true,
                  message: `请选择${item.textName}`,
                  trigger: "change",
                },
              ];
              break;
            case "date":
              rules[item.textKey] = [
                {
                  required: true,
                  message: `请选择${item.textName}`,
                  trigger: "change",
                },
              ];
              break;
            default:
              rules = {};
              break;
          }
        }
      });
      return rules;
    },
  },
};
</script>

<style>
</style>