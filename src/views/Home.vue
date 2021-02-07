<template>
  <div class="flex-box">
    <div id="home">
      <el-aside class="menu">
        <div class="logo">
          <img src="../assets/logo.png" style="width:40px;vertical-align: middle;" alt="">
          广州就业
        </div>
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
              <i class="el-icon-folder-opened"></i>
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
                <el-menu-item index="1-1">归档文件管理</el-menu-item>
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
                <el-menu-item index="2-1">归档文件管理</el-menu-item>
                <el-menu-item index="2-4">资料管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <span slot="title">审核管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-3">案卷管理</el-menu-item>
                <!-- <el-menu-item index="3-2">审核日志</el-menu-item> -->
                <el-menu-item index="3-1">归档文件管理</el-menu-item>
                <el-menu-item index="3-4">资料管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-share"></i>
              <span slot="title">开放管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">开放列表</el-menu-item>
              <!-- <el-menu-item index="5-2">开放日志</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="6">
            <i class="el-icon-search"></i>
            <span slot="title">综合检索</span>
          </el-menu-item>
          <el-menu-item index="7">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">统计管理</span>
          </el-menu-item>
          <el-submenu index="8">
            <template slot="title">
              <i class="el-icon-info"></i>
              <span slot="title">综合管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="8-1">公告管理</el-menu-item>
              <!-- <el-menu-item index="8-2">数据汇总</el-menu-item> -->
              <el-menu-item index="8-3">数据备份与恢复</el-menu-item>
              <el-menu-item index="8-4">数据查重</el-menu-item>
              <el-menu-item index="8-5">数据导入</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="9">
            <i class="el-icon-reading"></i>
            <span slot="title">全宗管理</span>
          </el-menu-item>
          <el-submenu index="10">
            <template slot="title">
              <i class="el-icon-s-help"></i>
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
              <i class="el-icon-setting"></i>
              <span slot="title">系统设置</span>
            </template>
            <el-menu-item-group>
              <!-- <el-menu-item index="11-1">模板维护</el-menu-item> -->
              <el-menu-item index="11-3">分类维护</el-menu-item>
              <!-- <el-menu-item index="11-4">报表打印</el-menu-item> -->
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
          >
            <Main />
          </el-main>
          <!-- <div v-if="navUrl" style="margin: 10px">
            <iframe
              :src="navUrl"
              :width="changeClientWidth"
              :height="tableHeight + 220"
              frameborder="0"
            />
          </div> -->
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Home/Header.vue";
import AsideL from "@/components/Home/AsideL";
import Main from "@/components/Home/Main.vue";
import AsideR from "@/components/Home/AsideR.vue";
// import { Drag } from "@/util/Drag";
import { TweenMax, Power4 } from "gsap";
import { mapGetters } from "vuex";
import SystemApi from "../api/services2/system";

export default {
  name: "home",
  data() {
    return {
      menuList: [],
      leftMarginLeft: "250px",
      mainMarginLeft: "0",
      asideLwidth: "22rem",
      Mainwidth: "42rem",
      leftToggle: true,
      rightToggle: true,
      defaultActive: "4",
      hideLeft: false,
    };
  },
  computed: {
    ...mapGetters("menu", ["navUrl", "tableHeight", "changeClientWidth"]),
    ModulePageNum() {
      return this.$store.getters.ModulePageNum;
    },
  },
  watch: {
    hideLeft(newValue) {
      newValue ? (this.mainMarginLeft = "250px") : (this.mainMarginLeft = "0");
    },
  },
  components: {
    Header,
    AsideL,
    Main,
    // AsideR,
  },
  methods: {
    getMenuList() {
      let data = {
        parentId: "",
      };
      SystemApi.getMenuTreeList(data).then((res) => {
        if (res.code === 200) {
          this.menuList = res.data;
        } else {
          this.$message.error("获取菜单列表失败,", res.message);
        }
      });
    },
    // 点击菜单
    menuSelect(index) {
      console.log(index);
      this.$store.commit("menu/GET_MENU_INDEX", index);
      this.$store.commit("doc/GET_DOC_LIST", []);
      switch (index) {
        case "11-1":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 111);
          break;
        case "8-4":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 84);
          break;
        case "10-4":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 104);
          break;
        case "5-1":
          this.hideLeft = false;
          this.$store.commit("setHeaderActiveIndex", 51);
          break;
        case "3-1":
          this.hideLeft = false;
          this.$store.commit("setHeaderActiveIndex", 31);
          break;
        case "3-3":
          this.hideLeft = false;
          this.$store.commit("setHeaderActiveIndex", 33);
          break;
        case "3-4":
          this.hideLeft = false;
          this.$store.commit("setHeaderActiveIndex", 34);
          break;
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
          this.$store.commit("setHeaderActiveIndex", 81);
          break;
        case "8-3":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 83);
          break;
        case "8-5":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 85);
          break;
        case "9":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 9);
          break;
        case "10-1":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 101);
          break;
        case "10-2":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 102);
          break;
        case "10-3":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 103);
          break;
        case "11-3":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 113);
          break;
        case "11-5":
          this.hideLeft = true;
          this.$store.commit("setHeaderActiveIndex", 115);
          break;
        default:
          this.hideLeft = false;
          this.$store.commit("setHeaderActiveIndex", 1);
          break;
      }
    },
    LeftMenuSwitch() {
      this.leftToggle = !this.leftToggle;
    },
    enter: function (el, done) {
      done;
      TweenMax.to(el, 0.6, {
        width: 250 + "px",
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
  },
};
</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
  .menu {
    width: 250px !important;
    position: fixed;
    z-index: 12;
    .logo {
      line-height: 59px;
      background-color: #2b2f3a;
      font-size: 20px;
      text-align: center;
      height: 59px;
      color: #fff;
    }
    ul {
      height: calc(100vh - 56px);
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
        // margin: 15px;
        border-right: 1px solid #ebeef5;
        // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
