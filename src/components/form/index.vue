<template>
  <div>
    <el-form :model="form" ref="form" :rules="rules" :label-width="labelWidth">
      <el-form-item v-if="!isDetail">
        <el-checkbox
          v-model="checked"
          label="开启继承注入"
          border
        ></el-checkbox>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12" v-for="(item, index) in formList" :key="index">
          <el-form-item
            :label="item.textName || item.label"
            :prop="item.textKey || null"
          >
            <el-input
              v-if="item.textType === 'input'"
              v-model="item.textValue"
              size="small"
              placeholder="请输入"
            />
            <el-select
              v-else-if="item.textType === 'select'"
              placeholder="请选择"
              size="small"
              v-model="item.textValue"
            >
              <el-option
                v-for="(item, index) in item.options"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
            <el-date-picker
              v-else-if="item.textType === 'date'"
              size="small"
              v-model="item.textValue"
              type="date"
              placeholder="请选择"
            >
            </el-date-picker>
            <el-input v-else v-model="item.textValue" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="!isSearch">
        <el-button
          type="primary"
          style="width: 200px"
          v-loading="loading"
          @click="submit"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { format } from "@/util/Time.js";
import ArchivesApi from "@/api/services2/archives";
export default {
  props: {
    labelWidth: {
      type: String,
      default: "120px",
    },
    formList: Array,
    isDetail: Boolean,
    isSearch: Boolean,
    categoryId: {
      type: [String, Number],
    },
    changeTime: Number
  },
  data() {
    return {
      form: {},
      rules: {},
      loading: false,
      checked: false,
    };
  },
  watch: {
    formList: {
      handler(newValue) {
        if (newValue.length > 0) {
          newValue.forEach((item, index) => {
            if (item.textType) {
              if (item.textType === "date") {
                let date = format(item.textValue, "yyyy-MM-dd");
                this.form[item.textKey] = date;
              } else {
                this.form[item.textKey] = item.textValue || "";
              }
            } else {
              this.form[item.fieldName] = "";
            }

            if (item.required) {
              switch (item.textType) {
                case "input":
                  this.rules[item.textKey] = [
                    {
                      required: true,
                      message: `请输入${item.textName}`,
                      trigger: "blur",
                    },
                  ];
                  break;
                case "select":
                  this.rules[item.textKey] = [
                    {
                      required: true,
                      message: `请选择${item.textName}`,
                      trigger: "blur",
                    },
                  ];
                  break;
                // case "date":
                //   this.rules[item.textKey] = [
                //     {
                //       required: true,
                //       message: `请选择${item.textName}`,
                //       trigger: "change",
                //       type:"string"
                //     },
                //   ];
                //   break;
                default:
                  this.rules = {};
                  break;
              }
            }
          });
        }
      },
      deep: true,
    },
    changeTime: {
      handler(newValue) {
        let vm = this;
        vm.formList.forEach((item) => {
          if (item.textKey == "serialNumber") {
            item.textValue = vm.addSerialNumber(item.textValue);
          }
        });
        this.cancel();
      },
    },
  },
  methods: {
    submit() {
      let vm = this;
      vm.loading = true;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.formList.map((item) => {
            if (item.textKey) {
              vm.form[item.textKey] = item.textValue;
            } else {
              vm.form[item.fieldName] = item.textValue;
            }
          });
          vm.$emit("submitFileForm", vm.form, vm.categoryId);
          vm.loading = false;
        }
      });
    },
    cancel() {
      let vm = this;
      if (!this.checked) {
        this.$emit("cancel", false);
      } else {
        let status = true;
        this.$emit("cancel", status);
      }
    },
    // 继承注入数字加一
    addSerialNumber(value) {
      var num = value;
      var length = num.length;
      var time = 0;
      var arr = num.split("");
      for (let i = 0; i < length; i++) {
        arr.forEach((item, index) => {
          if (item == 0 && index == 0) {
            arr.splice(0, 1);
            time += 1;
          } else {
            num = arr.join("");
          }
        });
      }
      num++;
      let str = "0";
      for (let j = 0; j < time; j++) {
        str += str;
      }
      str = str.slice(0, time);
      return str + num;
    },
  },
};
</script>

<style>
</style>