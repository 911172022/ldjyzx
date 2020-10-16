<template>
  <div class="login-page">
    <div class="container">
      <div class="main">
        <el-row class="info">
          <el-col :span="12">
            <div class="left">
              <!-- <img class="img" src="../assets/login/loginlogo4.png" /> -->
            </div>
          </el-col>
          <el-col :span="12">
            <div class="right">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-position="left"
                label-width="0px"
                class="login-container"
              >
                <h1 class="title">欢迎登陆</h1>
                <h3 class="subtitle">welcome</h3>
                <el-form-item prop="account">
                  <el-input
                    type="text"
                    v-model="ruleForm.account"
                    auto-complete="off"
                    placeholder="请输入用户名"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="Password">
                  <el-input
                    type="password"
                    v-model="ruleForm.Password"
                    auto-complete="off"
                    placeholder="请输入密码"
                  ></el-input>
                </el-form-item>
                <el-row style="margin-bottom: 20px">
                  <el-col :span="10">
                    <el-checkbox v-model="isRememberMe" class="remember"
                      >记住密码</el-checkbox
                    >
                  </el-col>
                  <el-col :span="10" :offset="4" style="text-align: right">
                    <el-link type="info" :underline="false">忘记密码?</el-link>
                  </el-col>
                </el-row>
                <el-form-item>
                  <el-button
                    type="primary"
                    class="loginbtn"
                    @click.native.prevent="onSubmit"
                    :loading="logining"
                    >登录</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- <div class="el-backtop" style="right: 100px; bottom: 50px;">
      <el-button class="DiskAndDataButton" type="primary" @click="pageChange">展示页</el-button>
    </div> -->
    <!-- <ShowPageButton /> -->
  </div>
</template>

<script>
import UserApi from "../api/Login";
import User from "../entity/User";
import ShowPageButton from "../plugins/common/ShowPageButton";

export default {
  data() {
    return {
      logining: false,
      ruleForm: {
        account: "", //'admin',
        Password: "", //'123456'
      },
      rules: {
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          //{ validator: validaePass }
        ],
        Password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          //{ validator: validaePass2 }
        ],
      },
      isRememberMe: true, // 是否记住我
    };
  },
  components: {
    ShowPageButton,
  },
  methods: {
    pageChange() {
      this.$router.push({ path: "/" });
    },
    onSubmit() {
      let vm = this;
      vm.logining = true;
      this.$router.push({ name: "DocManagement" });
      vm.logining = false;
      // vm.$refs.ruleForm.validate(valid => {
      //   if (valid) {
      //     let loginParams = {
      //       UserName: this.ruleForm.account,
      //       Password: this.ruleForm.Password
      //     };
      //     vm.loginHandle(loginParams);
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      //   vm.logining = false;
      // });
    },
    async loginHandle(e) {
      try {
        //调用api里面的 /login
        console.log("in login");
        let vm = this;
        let data = await UserApi.login(e);
        let { msg } = data;
        // 把登录api返回的token保持到storage
        let user = new User(msg, this.isRememberMe);
        this.$store.commit("SAVE_USER", user);
        vm.$router.push({ path: "/home" });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  height: 100%;
  .container {
    width: 100%;
    min-height: calc(100% - 150px);
    padding: 100px 0 50px;
    position: relative;
    z-index: 2;
    .main {
      width: 1000px;
      margin: 0 auto;
      .info {
        height: calc(100% - 100px);
        border-radius: 5px;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1),
          -1px 0 2px rgba(0, 0, 0, 0.05);
        .left {
          background: rgba(82, 143, 253, 0.8);
          height: calc(75vh - 80px);
          padding: 40px;
          text-align: center;
          .img {
            padding-top: 150px;
          }
        }
        .right {
          background: #fff;
          height: calc(75vh - 80px);
          padding: 40px;
          .login-container {
            width: calc(100% - 160px);
            padding: 100px 80px 0;
            .title {
              font-size: 2.5rem;
              line-height: 35px;
              color: #528ffd;
              margin: 0;
            }
            .subtitle {
              font-size: 1.5rem;
              color: #666666;
              margin: 0 0 40px;
            }
            .remember {
              font-size: 1rem;
            }
            .loginbtn {
              width: 100%;
              font-size: 1rem;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }
}
.login-page::before {
  content: "";
  width: 100%;
  height: 100%;
  display: block;
  background: #f0f2f5 url("../assets/login/background.png") no-repeat;
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
}
</style>
<style lang="scss">
@import "@/scss/index";
</style>
