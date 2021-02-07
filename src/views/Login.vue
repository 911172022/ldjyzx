<template>
  <div class="login-page">
    <div class="container">
      <div class="main">
        <el-row class="info">
          <el-col :span="12">
            <div class="left">
              <img src="@/assets/logo.png" style="margin-top: calc(100% - 200px)"  alt="广州就业服务">
              <h1 style="color: #fff;">广州就业</h1>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="right">
              <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-position="left"
                label-width="0px"
                @submit.native.prevent
                class="login-container"
              >
                <h1 class="title">欢迎登陆</h1>
                <h3 class="subtitle">welcome</h3>
                <el-form-item prop="account">
                  <el-input
                    type="text"
                    v-model="form.account"
                    auto-complete="off"
                    placeholder="请输入用户名"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="Password">
                  <el-input
                    type="password"
                    v-model="form.Password"
                    auto-complete="off"
                    placeholder="请输入密码"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-radio-group v-model="form.systemType">
                    <el-radio label="1">管理平台</el-radio>
                    <el-radio label="2">利用平台</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-row style="margin-bottom: 20px">
                  <el-col :span="10">
                    <el-checkbox v-model="isRememberMe" class="remember"
                      >记住密码</el-checkbox
                    >
                  </el-col>
                  <el-col :span="10" :offset="4" style="text-align: right">
                    <el-link type="info" :underline="false">忘记密码?</el-link>
                  </el-col>
                </el-row> -->
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
  </div>
</template>

<script>
import { login } from "../api/Login";

export default {
  data() {
    return {
      logining: false,
      form: {
        account: "", //'admin',
        Password: "", //'123456'
        systemType: "1", // 1是管理平台，2是利用平台
      },
      rules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        Password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      isRememberMe: true, // 是否记住我
    };
  },
  mounted() {
    this.keyDownEnter();
  },
  methods: {
    keyDownEnter() {
      document.onkeydown = (e) => {
        //按下回车提交
        let key = window.event.keyCode;
        //事件中keycode=13为回车事件
        if (key == 13) {
          this.onSubmit();
        }
      };
    },
    onSubmit() {
      let vm = this;
      vm.logining = true;
      vm.$refs.form.validate((valid) => {
        if (valid) {
          let loginParams = {
            account: this.form.account,
            password: this.form.Password,
            systemType: this.form.systemType,
          };
          login(loginParams).then((res) => {
            if (res.code === 200) {
              localStorage.setItem("LOGIN", res.data);
              this.$store.commit("SET_TOKEN", res.data);
              this.$message.success("登录成功");
              if (this.form.systemType == 1) {
                this.$router.push({ path: "/home" });
              } else {
                this.$router.push({ path: "/search-system" });
              }
            }
            vm.logining = false;
          });
        }
      });
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
          background: rgba(0, 0, 0, 0.8);
          // background: rgba(82, 143, 253, 0.8);
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
