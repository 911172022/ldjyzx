import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Message } from "element-ui";
import UserApi from "../api/services/user";
Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "home",
    redirect: { name: "DocManagement" }, // 根目录默认跳转到“文档管理”
    component: Home,
    meta: { title: "文档管理", auth: true },
    children: [
      {
        path: "Doc-Management",
        name: "DocManagement",
        meta: { title: "文档管理", headerActiveIndex: "1" }
      }
    ]
  },
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: { title: "登录页", auth: true },
    props: route => ({ refer: route.query.refer })
  },
  {
    path: "/error",
    name: "error",
    component: () => import("../views/Error.vue"),
    meta: { title: "出错了" }
  },
  // 其它情况，全都跳转到404页
  {
    path: "*",
    name: "not_found",
    component: () => import("../views/NotFound.vue"),
    meta: { title: "404" }
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../views/search.vue"),
    meta: { title: "搜索" }
  },
  {
    path: "/search-detail",
    name: "search-detail",
    component: () => import("../views/search-detail.vue"),
    meta: { title: "搜索详情" }
  },
  {
    path: "/file-detail",
    name: "file-detail",
    component: () => import("../views/FileDetails.vue"),
    meta: { title: "文件详情" }
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start();
  let token = localStorage.getItem("LOGIN");
  if (to.name !== "login" && !token) {
    next({ name: "login" });
  } else if (to.name === "login" && token) {
    next({ name: "home" });
  } else {
    next();
  }
});

router.afterEach(() => {
  // 进度条
  NProgress.done();
});

export default router;
