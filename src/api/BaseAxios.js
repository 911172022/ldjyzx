/*
 * @Author: your name
 * @Date: 2020-10-19 09:41:16
 * @LastEditTime: 2020-12-29 14:44:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gyy_oac:\Users\Shihx\Desktop\ldjyzx\src\api\BaseAxios.js
 */
import axios from "axios";
import { Message } from "element-ui";
import Router from "@/router/index";
import store from "@/store";
// 跨域
const { BASE_URL } = require("../const.js");

let requestConfig = {
  baseURL: process.env.NODE_ENV === "production" ? BASE_URL : BASE_URL, //  用于开发环境解决跨域
  timeout: 10000 //  请求超时时间
};

// 创建一个 axios 实例
const service = axios.create(requestConfig);

// 请求拦截器
service.interceptors.request.use(
  config => {
    let token = localStorage.getItem("LOGIN");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  error => {
    console.log(error);
    // 发送失败
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  res => {
    if (res.data.code !== 200) {
      return Message.error(res.data.message);
    }
    return res.data;
  },
  error => {
    let msg = error.response.data.message || error.response.data;
    if (msg == "用户授权过期或未授权，请重新登录！") {
      localStorage.removeItem("LOGIN");
      store.state.token = "";
      store.state.menu.menuIndex = "4";
      Router.push({ path: "/" });
      return Message.error(msg);
    } else {
      return Message.error(msg);
    }
  }
);

export default service;
