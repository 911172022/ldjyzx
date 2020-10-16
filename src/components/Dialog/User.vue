<template>
  <el-dialog
    title="用户设置"
    class="userSetting"
    :visible.sync="dialogObj.switch"
    width="90%"
  >
    <el-row>
      <!-- 左侧选单 - 用户 - 表格 -->
      <el-col :span="12">
        <el-input
          placeholder="搜索用户"
          prefix-icon="el-icon-search"
        ></el-input>
        <el-table
          ref="multipleTable"
          :data="userData"
          tooltip-effect="dark"
          style="width: 500px"
          height="550"
          class="dialogTable"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column prop="text" label="用户名" />
        </el-table>
      </el-col>
      <!-- 左侧选单 - 用户 - 表单 -->
      <el-col :span="12">
        <el-form :model="userForm" :rules="rules" ref="userForm">
          <el-form-item label="描述:" :label-width="formLabelWidth">
            <el-input
              v-model.trim="userForm.O_userdesc"
              autocomplete="off"
              placeholder="请输入描述"
              :disabled="isDisabledUser"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="电子邮箱:"
            prop="O_email"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model.trim="userForm.O_email"
              autocomplete="off"
              placeholder="请输入电子邮箱"
              :disabled="isDisabledUser"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系电话:"
            prop="Phone"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model.number="userForm.Phone"
              autocomplete="off"
              placeholder="请输入联系电话"
              :disabled="isDisabledUser"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="类型:"
            prop="region"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="userForm.UserType"
              style="width: 100%"
              :disabled="isDisabledUser"
            >
              <el-option
                v-for="item in Types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="状态:"
            prop="region"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="userForm.UserFlags"
              style="width: 100%"
              :disabled="isDisabledUser"
            >
              <el-option
                v-for="item in Status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="密码:"
            prop="password"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model.trim="userForm.password"
              autocomplete="off"
              placeholder="请输入密码"
              :disabled="isDisabledUser"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码:"
            prop="password2"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model.trim="userForm.password2"
              autocomplete="off"
              placeholder="请输入密码"
              :disabled="isDisabledUser"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="12" style="text-align: left">
          <el-button @click="createHandle">新建</el-button>
          <el-button @click="deleteUser" :disabled="isDelete">删除</el-button>
        </el-col>
        <el-col :span="12">
          <el-button @click="cancelHandle('userForm')">取消</el-button>
          <el-button
            v-if="!isNewUser"
            type="primary"
            @click="submitForm('userForm', 'userSave')"
            >保存</el-button
          >
          <el-button
            v-else
            type="primary"
            @click="submitForm('userForm', 'userAdd')"
            >添加</el-button
          >
        </el-col>
      </el-row>
    </span>
  </el-dialog>
</template>
<script>
import { isTelephoneValid } from "../../util/Regular";
import { TimeChange } from "../../util/Time";
import UserApi from "../../api/services/user";
import UserApi2 from "../../api/services/file";

export default {
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: function () {
        return {
          switch: false,
        };
      },
    },
  },
  data() {
    return {
      // 用户列表
      userData: [{ text: "邹粤" }],
      // 用户表单
      isDisabledUser: true,
      isNewUser: false,
      formLabelWidth: "120px",
      userForm: {},
      userId: "",
      Types: [
        {
          value: 0,
          label: "普通用户",
        },
        {
          value: 1,
          label: "管理员",
        },
      ],
      Status: [
        {
          value: 0,
          label: "可用",
        },
        {
          value: 1,
          label: "禁用",
        },
      ],
      rules: {
        UserCode: [{ required: true, message: "请输入代码", trigger: "blur" }],
        O_email: [
          { required: false, message: "请输入电子邮箱", trigger: "blur" },
          { type: "email", message: "格式不对", trigger: "blur" },
        ],
        Phone: [
          { required: false, message: "请输入电话", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value) {
                setTimeout(() => {
                  if (isTelephoneValid(value)) {
                    callback();
                  } else {
                    callback(new Error("手机号码格式不正确"));
                  }
                }, 250);
              } else {
                callback();
              }
            },
          },
        ],
        password: [
          { required: false, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 25, message: "长度在 5 到 25个字符" },
          {
            pattern: /^(\w){5,25}$/,
            message: "只能输入5-25个字母、数字、下划线",
          },
        ],
        password2: [
          { required: false, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 25, message: "长度在 5 到 25个字符" },
          {
            pattern: /^(\w){5,25}$/,
            message: "只能输入5-25个字母、数字、下划线",
          },
          {
            validator: (rule, value, callback) => {
              if (this.userForm.password) {
                if (value !== this.userForm.password) {
                  callback(new Error("两次输入密码不一致!"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
          },
        ],
      },
      isDelete: true,
      ServerFullFileName: "",
      isFile: {},
    };
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          // this.getAllUserList();
        }
      },
      deep: true,
    },
  },
  methods: {
    // 用户列表 - 请求数据
    async getAllUserList() {
      let page = 1,
        Group = "Root",
        limit = 50;
      const res = await UserApi.getAllUserList(page, limit, Group);
      if (res.success) {
        this.userData = res.data;
      }
    },
    // 用户表单 - 新建用户
    createHandle() {
      let vm = this;
      vm.userForm = {
        UserType: 0,
        UserFlags: 0,
      };
      vm.isDisabledUser = false;
      vm.isNewUser = true;
    },
    // 用户表单 - 重置
    resetForm() {
      let vm = this;
      vm.userForm = {};
      vm.isDisabledUser = true;
      vm.isDelete = true;
      vm.userId = "";
    },
    // 用户弹窗 - 取消按钮
    cancelHandle(formName) {
      let vm = this;
      this.dialogObj.switch = false;
      vm.$refs[formName].resetFields();
      vm.userData = [];
      vm.resetForm();
      vm.$emit("reData", false);
    },
    // 用户弹窗 - 关闭
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(() => {
    //       this.cancelHandle('userForm')
    //       done()
    //     })
    //     .catch(() => {})
    // },
    // 用户列表 - 单选
    async handleCurrentChange(val) {
      let vm = this;
      vm.userForm = {
        O_email: "911172022@qq.com",
        Phone: 13123456789,
        password: "123456",
        UserType: "普通用户",
        UserFlags: "可用",
      };
      vm.isDisabledUser = false;
      vm.isDelete = false;
    },
    // 用户列表 - 删除
    async deleteUser() {
      let vm = this;
      vm.resetForm();
      vm.$message({
        message: "删除成功",
        type: "success",
      });
    },
    async beforeAvatarUpload(file) {
      if (file.name) {
        this.isFile = file;
        let fileSize = file.size,
          ModifyDate = TimeChange(file.lastModifiedDate),
          ServerFileName = `BMP/${this.userForm.O_username}.jpg`;
        let ObjectKeyword = "",
          CreateDate = "";
        const res = await UserApi2.beforeUploadFile(
          ObjectKeyword,
          ServerFileName,
          CreateDate,
          ModifyDate,
          fileSize
        );
        this.ServerFullFileName = res.data[0].ServerFullFileName;
      }
    },
    async httpRequest(e) {
      if (this.ServerFullFileName) {
        let { ServerFullFileName } = this;
        let Files = e.file;
        await UserApi2.uploadFile(ServerFullFileName, Files);
      }
    },
    // 用户表单 - 上传文件成功
    async onSuccess() {
      let DocKeyword = "";
      let { ServerFullFileName } = this;
      await UserApi2.afterUploadFile(DocKeyword, ServerFullFileName);
      this.userForm.imgName = this.isFile.name;
      this.$message({ message: "上传成功", type: "success" });
    },
    // 用户表单 - 上传文件失败
    onError() {
      this.$message.error("上传失败");
    },
    // 用户表单 - 保存.添加
    submitForm(formName, e) {
      let vm = this;
      vm.$refs[formName].validate((valid) => {
        if (valid && e === "userSave") {
          let UserKeyword = vm.userId,
            UserCode = vm.userForm.O_username,
            UserDesc = vm.userForm.O_userdesc,
            UserEmail = vm.userForm.O_email,
            UserType = vm.userForm.UserType,
            UserStatus = vm.userForm.UserFlags,
            Phone = vm.userForm.Phone,
            UserPwd = vm.userForm.password,
            UserConfirmPwd = vm.userForm.password2;
          UserApi.saveUserInfo(
            UserKeyword,
            UserCode,
            UserDesc,
            UserEmail,
            UserType,
            UserStatus,
            Phone,
            UserPwd,
            UserConfirmPwd
          ).then((res) => {
            if (res.success) {
              vm.getAllUserList();
              vm.resetForm();
              vm.$message({
                message: "保存成功",
                type: "success",
              });
            } else {
              vm.$message({
                message: res.msg,
                type: "error",
              });
            }
          });
        } else if (valid && e === "userAdd") {
          if (!vm.userForm.O_username) {
            vm.$message({
              message: "请填写代码",
              type: "error",
            });
            return false;
          } else if (!vm.userForm.O_userdesc) {
            vm.$message({
              message: "请填写描述",
              type: "error",
            });
            return false;
          } else if (!vm.userForm.password) {
            vm.$message({
              message: "请填写密码",
              type: "error",
            });
            return false;
          }
          let UserCode = vm.userForm.O_username,
            UserDesc = vm.userForm.O_userdesc,
            UserEmail = vm.userForm.O_email,
            UserType = vm.userForm.UserType,
            UserStatus = vm.userForm.UserFlags,
            Phone = vm.userForm.Phone,
            UserPwd = vm.userForm.password,
            UserConfirmPwd = vm.userForm.password2;
          UserApi.createUser(
            UserCode,
            UserDesc,
            UserEmail,
            UserType,
            UserStatus,
            Phone,
            UserPwd,
            UserConfirmPwd
          ).then((res) => {
            if (res.success) {
              vm.getAllUserList();
              vm.resetForm();
              vm.$message({
                message: "添加成功",
                type: "success",
              });
            } else {
              vm.$message({
                message: res.msg,
                type: "error",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.userSetting .el-dialog {
  max-width: 900px;
}
</style>
