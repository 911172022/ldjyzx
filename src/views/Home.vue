<template>
  <div class="flex-box">
    <div id="home">
      <el-aside class="menu">
        <div class="logo">劳动就业管理中心</div>
        <el-menu
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :default-active="defaultActive"
          @select="menuSelect"
        >
          <el-submenu index="100">
            <template slot="title">
              <span slot="title">档案管理</span>
            </template>
            <el-menu-item index="4">
              <span slot="title">未归管理</span>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <span slot="title">预归档整理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-3">案卷管理</el-menu-item>
                <el-menu-item index="1-2">卷内管理</el-menu-item>
                <el-menu-item index="1-1">归档管理</el-menu-item>
                <el-menu-item index="1-4">资料管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <span slot="title">归档整理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-3">案卷管理</el-menu-item>
                <el-menu-item index="2-2">卷内管理</el-menu-item>
                <el-menu-item index="2-1">归档管理</el-menu-item>
                <el-menu-item index="2-4">资料管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <span slot="title">审核管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-3">案卷管理</el-menu-item>
                <el-menu-item index="3-2">审核日志</el-menu-item>
                <el-menu-item index="3-1">归档管理</el-menu-item>
                <el-menu-item index="3-4">资料管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <span slot="title">开放管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">开放列表</el-menu-item>
              <el-menu-item index="5-2">开放日志</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="6">
            <span slot="title">综合检索</span>
          </el-menu-item>
          <el-menu-item index="7">
            <span slot="title">统计管理</span>
          </el-menu-item>
          <el-submenu index="8">
            <template slot="title">
              <span slot="title">综合管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="8-1">公告管理</el-menu-item>
              <el-menu-item index="8-2">数据汇总</el-menu-item>
              <el-menu-item index="8-3">数据备份与恢复</el-menu-item>
              <el-menu-item index="8-4">数据查重</el-menu-item>
              <el-menu-item index="8-5">数据导入</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="9">
            <template slot="title">
              <span slot="title">全宗管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="9-1">全宗增加</el-menu-item>
              <el-menu-item index="9-2">全宗修改</el-menu-item>
              <el-menu-item index="9-3">全宗打印</el-menu-item>
              <el-menu-item index="9-4">全宗历史沿革</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="10">
            <template slot="title">
              <span slot="title">安全维护</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="10-1">单位管理</el-menu-item>
              <el-menu-item index="10-2">用户管理</el-menu-item>
              <el-menu-item index="10-3">用户组管理</el-menu-item>
              <el-menu-item index="10-4">日志管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="11">
            <template slot="title">
              <span slot="title">系统设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="11-1">模板维护</el-menu-item>
              <el-menu-item index="11-2">档号设置</el-menu-item>
              <el-menu-item index="11-3">分类维护</el-menu-item>
              <el-menu-item index="11-4">报表打印</el-menu-item>
              <el-menu-item index="11-5">报表管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-container>
          <transition
            @enter="enter"
            @leave="leave"
            :css="false"
            v-if="!navUrl && !hideLeft"
          >
            <el-aside
              id="left"
              v-show="leftToggle"
              :style="{ marginLeft: leftMarginLeft }"
              :width="asideLwidth"
            >
              <el-row style="height: 100%">
                <el-col v-show="leftToggle" :span="22" style="height: 100%">
                  <AsideL />
                </el-col>
                <el-col :span="1" style="height: 100%">
                  <i
                    class="iconBtn"
                    :class="
                      leftToggle ? 'el-icon-caret-left' : 'el-icon-caret-right'
                    "
                    @click="LeftMenuSwitch"
                  />
                </el-col>
                <!-- <el-col v-show="leftToggle" :span="1" style="height: 100%">
                  <i id="resize" class="el-icon-caret-right" />
                </el-col> -->
              </el-row>
            </el-aside>
          </transition>
          <el-main
            id="main"
            :style="{ marginLeft: mainMarginLeft }"
            :width="Mainwidth"
            v-if="!navUrl"
          >
            <Main />
          </el-main>
          <div v-if="navUrl" style="margin: 10px">
            <iframe
              :src="navUrl"
              :width="changeClientWidth"
              :height="tableHeight + 220"
              frameborder="0"
            />
          </div>
        </el-container>
      </el-container>
    </div>
    <User :dialogObj="userData" @reData="reUserData"></User>
    <UserGroup :dialogObj="userGroupData" @reData="reGroupData"></UserGroup>
  </div>
</template>

<script>
import Header from "@/components/Home/Header.vue";
import AsideL from "@/components/Home/AsideL";
import Main from "@/components/Home/Main.vue";
import AsideR from "@/components/Home/AsideR.vue";
import UserApi from "../api/services/message";
import { Drag } from "@/util/Drag";
import { TweenMax, Power4 } from "gsap";
import { mapGetters } from "vuex";
import UserApi2 from "../api/services/project";

import downloadTasks from "../components/download/downloadTasks.vue";
import uploadTasks from "../components/UploadFiles/uploadTasks.vue";
import openFiles from "../components/openFiles/openFiles.vue";
import { fail } from "assert";

import UserGroup from "../components/Dialog/UserGroup";
import User from "../components/Dialog/User";

export default {
  name: "home",
  data() {
    return {
      leftMarginLeft: "250px",
      mainMarginLeft: "20px",
      asideLwidth: "22rem",
      Mainwidth: "42rem",
      leftToggle: true,
      rightToggle: true,
      notify: [],
      // 修复右边收起时收起左边右边会弹出来的bug
      asideRwidth: "28rem",
      asideREvent: null,
      defaultActive: "1-1",
      hideLeft: false,
      userGroupData: {
        switch: false,
      },
      userData: {
        switch: false,
      },
    };
  },
  mounted() {
    // let resize = document.getElementById("resize");
    // let left = document.getElementById("left");
    // let main = document.getElementById("main");
    // let right = document.getElementById("right");
    // let home = document.getElementById("home");
    // Drag(resize, left, main, right, home);
    // 2020.4.15-1
    this.$notify.closeAll();
    // this.getNewMessage();
    this.hideRight();

    // 2020-5-26 获取之前上传没上传完的信息
    // 先对比跟上次上传的是不是同一个用户
    // if (
    //   sessionStorage.getItem("username") ===
    //   localStorage.getItem("lastUploadUserName")
    // ) {
    //   let lastFileList = localStorage.getItem("uncompletedUploadList");
    //   let lastProjectKeyWord = localStorage.getItem("lastUploadProjectKeyWord");

    //   if (lastFileList && lastFileList.length != 0) {
    //     this.$notify({
    //       title: "上传未完成任务",
    //       message: `以下文件上传未完成${lastFileList}`,
    //       type: "warning",
    //       duration: 0,
    //       customClass: "uploadNotify",
    //       onClick: async () => {
    //         // 跳转
    //         // 获取 ProjectKeyWord
    //         let Keyword = lastProjectKeyWord,
    //           IgnoreShortCut = "false";
    //         const res = await UserApi2.getProjectPath(Keyword, IgnoreShortCut);
    //         if (res.success) {
    //           const ProjectKeyWord = res.data[0].ProjectKeyword;
    //           //  储存位置
    //           await UserApi2.saveLastProject(ProjectKeyWord);
    //           this.$router.push({ name: "DocManagement" });
    //           this.$store.commit("project/REFRESH_TREE", true);
    //         }
    //       },
    //       onClose: () => {
    //         // 清空缓存内的信息
    //         localStorage.setItem("uncompletedUploadList", "");
    //         localStorage.setItem("lastUploadProjectKeyWord", "");
    //         localStorage.setItem("lastUploadUserName", "");
    //       },
    //     });
    //   }
    // }
  },
  computed: {
    ...mapGetters("AdjustMenuWidth", ["TabsName", "switch"]),
    ...mapGetters("menu", ["navUrl", "tableHeight", "changeClientWidth"]),
    ...mapGetters("home", ["asideRNotice", "asideRShowNotice"]),
    ModulePageNum() {
      return this.$store.getters.ModulePageNum;
    },
  },
  watch: {
    hideLeft(newValue) {
      newValue
        ? (this.mainMarginLeft = "270px")
        : (this.mainMarginLeft = "20px");
    },
    // 只要这个值有变动，就隐藏asideR
    asideRNotice() {
      this.rightToggle = false;
    },
    // 只要这个值有变动，就显示asideR
    asideRShowNotice() {
      this.rightToggle = true;
    },
  },
  components: {
    User,
    UserGroup,
    Header,
    AsideL,
    Main,
    AsideR,
    downloadTasks,
    uploadTasks,
    // testComponents,
    openFiles,
  },
  methods: {
    // 原型代码
    reGroupData(e) {
      this.userGroupData.switch = e;
    },
    reUserData(e) {
      this.userGroup.switch = e;
    },
    // 点击菜单
    menuSelect(index) {
      console.log(index);
      switch (index) {
        case "6": {
          const { href } = this.$router.resolve({
            name: "search",
          });
          window.open(href, "_blank");
          this.hideLeft = false;
          this.$store.commit("setHeaderActiveIndex", 1);
          break;
        }
        case "7":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", index);
          break;
        case "8-1":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 2);
          break;
        case "9-1":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 1);
          break;
        case "9-2":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 1);
          break;
        case "9-3":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 1);
          break;
        case "9-4":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 1);
          break;
        case "10-2":
          this.userData.switch = true;
          break;
        case "10-3":
          this.userGroupData.switch = true;
          break;
        default:
          this.hideLeft = false;
          this.$store.commit("setHeaderActiveIndex", 1);
          break;
      }
    },
    pageChange() {
      this.$router.push({ path: "/" });
    },
    hideRight() {
      if (document.body.clientWidth < 1450) {
        this.rightToggle = false;
      }
    },
    // 获取新消息
    getNewMessage() {
      let vm = this;
      UserApi.getUserNoReadMessageList().then((res) => {
        if (res.success) {
          vm.notify = this.$notify({
            title: res.data[0].Title,
            message: res.data[0].Content,
            dangerouslyUseHTMLString: true,
            //  弹出后1min关闭
            duration: 1000 * 60,
            position: "bottom-right",
            onClick() {
              vm.$router.push({ path: "Per-Message" });
              vm.$store.commit("menu/GET_NAVURL", "");
              vm.notify.close();
            },
            // 2020.4.15-1
            // 关闭后3min后再查询一个出来
            onClose() {
              setTimeout(() => {
                vm.getNewMessage();
              }, 1000 * 180);
            },
          });
        }
      });
    },
    LeftMenuSwitch() {
      this.leftToggle = !this.leftToggle;
    },
    RightMenuSwitch() {
      this.rightToggle = !this.rightToggle;
    },
    enter: function (el, done) {
      done;
      TweenMax.to(el, 0.6, {
        width: 15 + "%",
        paddingLeft: 15 + "px",
        ease: Power4.easeOut,
      });
    },
    leave: function (el, done) {
      done;
      TweenMax.to(el, 0.6, {
        width: 35 + "px",
        paddingLeft: 3 + "px",
        ease: Power4.easeOut,
      });
    },
    enter2: function (el, done) {
      done;
      TweenMax.to(el, 0.6, {
        width: 20 + "%",
        paddingLeft: 0 + "px",
        ease: Power4.easeOut,
        onComplete: () => {
          if (this.asideREvent != "leave") {
            this.asideRwidth = "20%";
          }
        },
        onStart: () => {
          this.asideREvent = "enter";
        },
      });
    },
    leave2: function (el, done) {
      done;
      TweenMax.to(el, 0.6, {
        width: 35 + "px",
        paddingLeft: 4 + "px",
        ease: Power4.easeOut,
        onComplete: () => {
          if (this.asideREvent != "enter") {
            this.asideRwidth = "35px";
          }
        },
        onStart: () => {
          this.asideREvent = "leave";
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
  .menu {
    position: fixed;
    z-index: 12;
    .logo {
      width: 250px;
      line-height: 59px;
      background-color: #2b2f3a;
      font-size: 20px;
      text-align: center;
      height: 59px;
      color: #fff;
    }
    ul {
      width: 250px;
      height: calc(100vh - 60px);
      overflow: auto;
    }
  }
}
#home {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: hidden;
  .el-container {
    background-color: #f5f6fa;
    height: 100%;
    .el-header {
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 11;
      padding: 0;
      box-sizing: content-box;
    }
    .el-container {
      height: calc(100% - 60px);
      margin-top: 60px;
      .el-aside {
        padding: 15px;
        background-color: #fff;
      }
      .el-aside#left {
        overflow: inherit;
        padding-right: 0;
        border-right: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .el-col-22 {
          width: calc(100% - 40px);
        }
        .el-col-1 {
          width: 20px;
          #resize {
            display: block;
            font-size: 16px;
            width: 10px;
            cursor: w-resize;
            padding-top: 380px;
          }
        }
      }
      .el-main {
        background-color: #fff;
        margin: 15px;
        border-right: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .el-aside#right {
        padding-left: 0;
        border-left: 1px solid #ebeef5;
        box-shadow: -2px 0 12px 0 rgba(0, 0, 0, 0.1);
        .el-row.right_position {
          position: static;
        }
        .el-col-22 {
          width: calc(100% - 40px);
        }
        .el-col-1 {
          width: 20px;
          #resize2 {
            display: block;
            font-size: 16px;
            width: 10px;
            cursor: w-resize;
            padding-top: 380px;
          }
        }
      }
    }
  }
}
.iconBtn {
  font-size: 15px;
  padding: 4px;
  color: #ffffff;
  background: #ffbc40;
  border-radius: 50%;
  cursor: pointer;
}
.iconBtn:hover {
  background: #ffcd70;
}
</style>
<style lang="scss">
@import "@/scss/Common";
</style>
