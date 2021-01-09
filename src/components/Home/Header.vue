<template>
  <div>
    <el-row class="header">
      <el-col class="UserPanel" :span="24">
        <div class="user-wrapper">
          <div></div>
          <el-dropdown trigger="click">
            <div
              class="el-dropdown-link"
              style="display: flex; align-items: center"
            >
              <div>{{ sysUserName }}</div>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="PersonalCenter">
                <i class="el-icon-user-solid"></i> 个人中心
              </el-dropdown-item>
              <!-- <el-dropdown-item @click.native="openRecycle">
                <i class="el-icon-delete"></i> 回收站
              </el-dropdown-item> -->
              <el-dropdown-item divided @click.native="logout"
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <!-- 个人中心 -->
    <el-dialog
      title="个人中心"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false"
      :before-close="handleClose"
      append-to-body
    >
      <el-form
        :model="userForm"
        ref="userForm"
        :rules="rules"
        label-position="top"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input v-model="userForm.account" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="userForm.username" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="旧密码" prop="OldPassword">
              <el-input
                v-model="userForm.OldPassword"
                placeholder="请输入旧密码"
                show-password
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="新密码" prop="NewPassword">
              <el-input
                v-model="userForm.NewPassword"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="NewPassword2">
              <el-input
                v-model="userForm.NewPassword2"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm('userForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UserApi from "../../api/services2/user";
import { isTelephoneValid } from "../../util/Regular";
// import { mapGetters } from "vuex";
// import { TimeChange } from "../../util/Time";
import { loginOut } from "@/api/Login";
export default {
  data() {
    return {
      isCollapse: false,
      userName: "",
      sysName: "劳动就业管理中心",
      sysUserName: "账号管理",
      sysUserAvatar: "",
      dialogVisible: false, // 个人中心弹窗
      // 个人中心
      userForm: {
        account: "",
        username: "",
        O_userdesc: "",
        O_email: "",
        Phone: "",
        UserType: "",
        UserFlags: "",
        OldPassword: "",
        NewPassword: "",
        NewPassword2: "",
      },
      rules: {
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
        O_email: [
          {
            required: false,
            message: "请输入电子邮箱",
            trigger: "blur",
          },
          { type: "email", message: "格式不对", trigger: "blur" },
        ],
        OldPassword: [
          {
            required: false,
            message: "请输入旧密码",
            trigger: "blur",
          },
          { min: 5, max: 25, message: "长度在 5 到 25个字符" },
          {
            pattern: /^(\w){5,25}$/,
            message: "只能输入5-25个字母、数字、下划线",
          },
        ],
        NewPassword: [
          {
            required: false,
            message: "请输入新密码",
            trigger: "blur",
          },
          { min: 6, max: 25, message: "长度在 6 到 25个字符" },
          {
            pattern: /^(\w){6,25}$/,
            message: "只能输入6-25个字母、数字、下划线",
          },
        ],
        NewPassword2: [
          {
            required: false,
            message: "请输入新密码",
            trigger: "blur",
          },
          { min: 6, max: 25, message: "长度在 6 到 25个字符" },
          {
            pattern: /^(\w){6,25}$/,
            message: "只能输入6-25个字母、数字、下划线",
          },
          {
            validator: (rule, value, callback) => {
              if (this.userForm.NewPassword) {
                if (value !== this.userForm.NewPassword) {
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
      errorHandler: true,
      // 回收站
      RecycleBinVisible: false,
      recycleData: [],
      formInline: {
        type: "0",
        time: "0",
        region: "0",
      },
      keyArr: [],
      userKeyword: "",
      PermissionData: {
        switch: false,
      },
      pagination: {
        pageSize: 0,
        total: 0,
      },
      page: 1,
      loadingRecycleBin: false,
      currentPage: 1,
      timeSelected: "",
      // 放computed检测不到
      datePickerShow: "",
      // 选择删除者
      selectedUser: "全部",
    };
  },
  computed: {
    activeIndex() {
      return this.$store.state.headerActiveIndex;
    },
  },
  methods: {
    // 点击个人中心获取个人信息
    getMyInfo() {
      UserApi.getMyInfo().then((res) => {
        if (res.code === 200) {
          this.userForm.account = res.data.account;
          this.userForm.username = res.data.username;
        } 
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.cropperModel = false;
      this.errorHandler = true;
      this.RecycleBinVisible = false;
      this.userForm = {
        username: "",
        O_userdesc: "",
        O_email: "",
        Phone: "",
        UserType: "",
        UserFlags: "",
        OldPassword: "",
        NewPassword: "",
        NewPassword2: "",
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            password: this.userForm.NewPassword,
            confirmPassword: this.userForm.NewPassword2,
          };
          UserApi.updatePwd(data).then((res) => {
            if (res.code === 200) {
              this.$message.success("修改密码成功");
              this.dialogVisible = false;
            }
          });
        }
      });
    },
    // 开启个人中心
    async PersonalCenter() {
      this.dialogVisible = true;
      this.getMyInfo();
    },
    //退出登录
    logout: function () {
      var vm = this;
      vm.$confirm("确认退出吗?", "提示", {}).then(() => {
        loginOut().then((res) => {
          if (res.code === 200) {
            this.$message.success("退出成功");
            this.$store.commit("SET_TOKEN", "");
            localStorage.removeItem("LOGIN")
            this.$router.push("/");
          } 
        });
      });
    },
  },
};
</script>
<style lang="scss">
.UserPanel {
  text-align: right;
  .el-dropdown-link {
    cursor: pointer;
  }
  .el-button--text:focus,
  .el-button--text:hover {
    color: #ffbc40;
  }
}
</style>
<style lang="scss">
@import "@/scss/_variables";
.header {
  height: 60px;
  line-height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .el-menu {
    background-color: $main-color-light;
    .el-menu-item i {
      color: #fff;
    }
    .el-menu-item.is-active {
      border-bottom: 0;
      color: #fff;
      background-color: #2b76fd;
    }
  }
  .el-menu--horizontal {
    border-bottom: 0;
    .el-menu-item {
      border-bottom: 0;
    }
    .el-menu-item:not(.is-disabled):hover,
    .el-menu-item:not(.is-disabled):focus {
      background-color: #2b76fd;
      color: #fff;
    }
  }
  .el-menu.el-menu--horizontal {
    border-bottom: 0;
  }
  .header-logo {
    padding: 0 15px;
    img {
      object-fit: scale-down;
      width: 100%;
      height: 100%;
      max-height: 45px;
      vertical-align: middle;
      @media screen and (min-width: 1919px) {
        width: 300px;
      }
    }
  }
}
.recycle-footer {
  .el-form-item__content {
    width: 120px;
  }
}
.dropmenu {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #606266;
}
.dropmenu > div {
  margin-right: 20px;
}
#RecycleBinDialog .el-dialog {
  max-width: 900px;
}
@media screen and (max-width: 1400px) {
  .el-menu {
    .el-menu-item {
      padding: 0 15px;
    }
  }
}
@media screen and (max-width: 1300px) {
  .el-menu {
    .el-menu-item {
      padding: 0 5px;
    }
  }
}
.nav-wrapper {
  max-height: 60px;
  overflow: hidden;
}
.nav-wrapper:hover {
  overflow: inherit;
}
.user-wrapper {
  display: flex;
  max-height: 60px;
  margin-right: 20px;
}
.UserPanel {
  display: flex;
  justify-content: flex-end;
}
</style>
