<template>
  <div class="login-page">
    <div class="container">
      <div class="login-logo">
        <img src="../assets/login/login_logo2.png" object-fit="scale-down" alt />
      </div>
      <div class="main">
        <div class="titleImg">
          <img :src="loginLogoSrc" alt />
        </div>
        <el-row class="info" :gutter="40">
          <el-col :span="14">
            <div class="left">
              <img class="img" src="../assets/login/login_build.png" />
            </div>
          </el-col>
          <el-col :span="10">
            <div class="right">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-position="left"
                label-width="0px"
                class="login-container"
              >
                <div class="title">欢迎登陆</div>
                <el-form-item prop="account" label="账号" label-width="100">
                  <el-input
                    prefix-icon="el-icon-user-solid"
                    type="text"
                    v-model="ruleForm.account"
                    auto-complete="off"
                    placeholder="请输入用户名"
                    @keyup.enter.native="onSubmit"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="Password" label="密码" label-width="100">
                  <el-input
                    prefix-icon="el-icon-lock"
                    type="password"
                    v-model="ruleForm.Password"
                    placeholder="请输入密码"
                    auto-complete="off"
                    @keyup.enter.native="onSubmit"
                  ></el-input>
                </el-form-item>
                <el-row style="margin-bottom: 20px;">
                  <el-col :span="10">
                    <!-- <el-checkbox v-model="isRememberMe" class="remember">记住密码</el-checkbox> -->
                    <el-checkbox v-model="isRememberMe" class="remember">记住我</el-checkbox>
                  </el-col>
                  <el-col :span="10" :offset="4" style="text-align: right;">
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
        </div>-->
    <ShowPageButton />
  </div>
</template>

<script>
// import UserApi from "../api/Login";
// import User from "../entity/User";

// 跨域
// import UserApi from "../api/Login";
import UserApi2 from "../api/services/dbsource";
import User from "../entity/User";

import { PluginsList } from "../const.js";

import ShowPageButton from "../plugins/common/ShowPageButton";
import { Base64 } from "js-base64";

export default {
  data() {
    return {
      logining: false,
      ruleForm: {
        account: "", //'admin',
        Password: "" //'123456'
      },
      rules: {
        account: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        Password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      isRememberMe: false // 是否记住我
    };
  },
  components: {
    ShowPageButton
  },
  mounted() {
    // 根据sessionStorage判断用户有没有勾选记住密码
    if (sessionStorage.getItem("isRememberMe")) {
      this.isRememberMe = true;
      this.ruleForm.account = sessionStorage.getItem("username") || "";
      let initPass = sessionStorage.getItem("password") ? Base64.decode(sessionStorage.getItem("password")) : ""
      this.ruleForm.Password = initPass;
    }
  },
  computed: {
    loginLogoSrc() {
      if (PluginsList.indexOf("FYPlugin") != -1) {
        return require("../assets/login/login_title2.png");
      } else {
        return require("../assets/login/login_title.png");
      }
    }
  },
  methods: {
    onSubmit() {
      let vm = this;
      vm.logining = true;
      vm.$refs.ruleForm.validate(valid => {
        if (valid) {
          // let loginParams = {
          //   UserName: this.ruleForm.account,
          //   Password: this.ruleForm.Password
          // };
          // vm.loginHandle(loginParams);
          // 跨域
          let UserName = this.ruleForm.account;
          let Password = this.ruleForm.Password;
          vm.loginHandle(UserName, Password);
        } else {
          console.log("error submit!!");
          vm.logining = false;
          return false;
        }
        vm.logining = false;
      });
    },
    // async loginHandle(e) {
    //   try {
    //     //调用api里面的 /login
    //     let vm = this;
    //     let data = await UserApi.login(e);
    //     if(data.success) {
    //         if(this.isRememberMe) {
    //           sessionStorage.setItem("username", this.ruleForm.account);
    //           sessionStorage.setItem("password", Base64.encode(this.ruleForm.Password));
    //         }
    //         sessionStorage.setItem('isRememberMe', this.isRememberMe)
    //     } else {
    //       let err = data.errors.errorMsg
    //       err = err.slice(err.indexOf('错误', 5) + 3, err.length)
    //       this.$message({
    //         message: err,
    //         type: 'error'
    //       })
    //     }
    //     let { msg } = data;
    //     // 把登录api返回的token保持到storage
    //     let user = new User(msg, this.isRememberMe);
    //     this.$store.commit("SAVE_USER", user);
    //     // 判断是摁资料盘来的还是摁产品页来的
    //     if(this.$route.query.refer === 'productLibrary'){
    //       vm.$router.push({ path: '/product/product-base'})
    //     } else {
    //       vm.$router.push({ path: "/home" });
    //
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // 跨域
    async loginHandle(UserName, Password) {
      try {
        //调用api里面的  /login
        let vm = this;
        UserApi2.login(UserName, Password).then(data => {
          console.log(data);
          if (data.success) {
            if (this.isRememberMe) {
              sessionStorage.setItem("username", this.ruleForm.account);
              sessionStorage.setItem("password", Base64.encode(this.ruleForm.Password));
            }
            sessionStorage.setItem("isRememberMe", this.isRememberMe);
            let msg = data.data[0];
            //  把登录api返回的token保持到storage
            let user = new User(msg, this.isRememberMe);
            this.$store.commit("SAVE_USER", user);
            //  判断是摁资料盘来的还是摁产品页来的
            if (this.$route.query.refer === "productLibrary") {
              vm.$router.push({
                path: "/product-second/product-base2"
              });
            } else {
              vm.$router.push({
                path: "/home"
              });
            }
          }
          // 处理登录错误
          else {
            this.$message({
              message: data.errors.errorMsg,
              type: "error"
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  height: 100%;
  @media screen and (max-width: 1600px) {
    zoom: 0.75;
  }
  @media screen and (max-width: 1401px) {
    zoom: 0.6;
  }
  .container {
    width: 100%;
    min-height: calc(100% - 150px);
    padding: 100px 0 38px;
    position: relative;
    z-index: 2;
    .login-logo {
      position: absolute;
      left: 27px;
      top: 40px;
      img {
        width: 25%;
      }
    }
    .main {
      width: 1100px;
      margin: 0 auto;
      .titleImg {
        text-align: center;
        padding-bottom: 100px;
        img {
          width: 40%;
          max-height: 100px;
          min-height: 80px;
          max-width: 400px;
        }
      }
      .info {
        height: calc(100% - 100px);
        border-radius: 5px;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1), -1px 0 2px rgba(0, 0, 0, 0.05);
        .left {
          position: absolute;
          left: 0;
          top: 0;
          margin-left: -200px;
          animation: left 2s;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .right {
          position: absolute;
          right: 0;
          top: 0;
          background: rgba(255, 255, 255, 0.2);
          width: 400px;
          height: 482px;
          border-radius: 6px;
          color: #fff;
          animation: right 2s;
          .login-container {
            padding: 35px;
            .title {
              font-size: 2.5rem;
              line-height: 35px;
              margin: 33px 0;
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
@keyframes left {
  from {
    left: -100px;
  }
  to {
    left: 0;
  }
}
@keyframes right {
  from {
    right: -100px;
  }
  to {
    right: 0;
  }
}
.login-page::before {
  content: "";
  width: 100%;
  height: 100%;
  display: block;
  background: #f0f2f5 url("../assets/login/login_bgimg.png") no-repeat;
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  background-size: cover;
}
</style>
<style lang="scss">
@import "@/scss/index";
.login-page {
  .el-form-item__label {
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
.left .img {
  background: none !important;
}
</style>
