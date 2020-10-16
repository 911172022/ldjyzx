import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Message } from "element-ui";
import UserApi from "../api/services/user";
import Product from "../views/Product.vue";
import ProductSecond from "../views/ProductSecond.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/test",
    component: () => import("../views/test.vue")
  },
  {
    path: "/bosView",
    component: () => import("../views/bosView.vue")
  },

  // {
  //   path: "/",
  //   alias: "/index",
  //   name: "index",
  //   component: () => import(/* webpackChunkName: "index" */ "../views/index.vue"),
  //   meta: { title: "首页", auth: true }
  // },
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
      {
        path: "Per-Message",
        name: "PerMessage",
        meta: { title: "个人消息", headerActiveIndex: "2" }
      },
      {
        path: "Pro-Workbench",
        name: "ProWorkbench",
        meta: { title: "流程工作台", headerActiveIndex: "3" }
      },
      {
        path: "Per-Workbench",
        name: "PerWorkbench",
        meta: { title: "个人工作台", headerActiveIndex: "4" }
      },
      {
        path: "Logical-Directory",
        name: "LogicalDirectory",
        meta: { title: "逻辑目录", headerActiveIndex: "5" }
      },
      {
        path: "Doc-Select",
        name: "DocSelect",
        meta: { title: "文档查询", headerActiveIndex: "6" }
      },
      {
        path: "Navigation",
        name: "Navigation",
        meta: { title: "导航页", headerActiveIndex: "7" }
      }
    ]
  },
  {
    path: "/product",
    name: "Product",
    redirect: { name: "ProductBase" }, // 根目录默认跳转到“产品库”
    component: Product,
    meta: { title: "产品库", auth: true },
    children: [
      {
        path: "product-base",
        name: "ProductBase",
        meta: { title: "产品库", headerActiveIndex: "8" }
      },
      {
        path: "product-base-setting",
        name: "ProductBaseSetting",
        meta: { title: "产品库设定", headerActiveIndex: "9" }
      }
    ]
  },
  {
    path: "/product-second",
    name: "ProductSecond",
    redirect: { name: "ProductBase2" }, // 根目录默认跳转到“产品库”
    component: ProductSecond,
    meta: { title: "产品库", auth: true },
    children: [
      {
        path: "product-base2",
        name: "ProductBase2",
        meta: { title: "产品库", headerActiveIndex: "10" }
      },
      {
        path: "product-base-setting2",
        name: "ProductBaseSetting2",
        meta: { title: "产品库设定", headerActiveIndex: "11" }
      }
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
