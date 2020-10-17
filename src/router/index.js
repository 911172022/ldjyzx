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
      },
    ]
  },
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login2.vue"),
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

// router.beforeEach((to, from, next) => {
//   // 进度条
//   NProgress.start();
//   if (to.meta.headerActiveIndex) {
//     store.commit("setHeaderActiveIndex", to.meta.headerActiveIndex);
//   }
//   if (to.matched.some(r => r.meta.auth)) {
//     store.commit("INIT_USER_STATE");
//     let sid = store.getters.sid;
//     if (to.name === "index") next();
//     // 用户不是访问登录页
//     else if (to.name !== "login" && sid) {
//       store.commit("INIT_USER_STATE");
//       sid = store.getters.sid;
//       // 用户状态为登录，判断是否有 sid 超时
//       UserApi.getNavigationDisplay(sid).then(res => {
//         if (res) {
//           next();
//         } else {
//           // Message.error('登录超时, 请重新登录')
//           store.commit("REMOVE_USER");
//           next({ name: "login" });
//         }
//       });
//     } else if (to.name !== "login" && !sid) {
//       store.commit("REMOVE_USER");
//       if (to.name === "ProductBase2") {
//         next({ path: "/login?refer=productLibrary" });
//       } else {
//         next({ name: "login" });
//       }
//     }
//     // 用户访问登录页
//     else {
//       let sid = localStorage.getItem("sid") || sessionStorage.getItem("sid");
//       if (sid) {
//         store.commit("INIT_USER_STATE");
//         sid = store.getters.sid;
//         // 用户状态为登录，判断是否有 sid 超时
//         UserApi.getNavigationDisplay(sid).then(res => {
//           if (res) {
//             // 判断进入产品库还是资料盘
//             if (to.query.refer === "productLibrary") {
//               next({ name: "ProductBase2" });
//             } else {
//               next({ name: "home" });
//             }
//           } else {
//             store.commit("REMOVE_USER");
//             next();
//           }
//         });
//       } else {
//         next();
//       }
//     }
//   } else {
//     next();
//   }
// });

// router.afterEach(() => {
//   // 进度条
//   NProgress.done();
// });

export default router;
