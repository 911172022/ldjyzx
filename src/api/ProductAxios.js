/*
 * @Author: CiFong
 * @Date: 2020-07-28 17:01:37
 * @LastEditors: CiFong
 * @LastEditTime: 2020-08-24 15:19:38
 * @Description: 请输入
 */
import axios from "axios";
import router from "../router";
import { Message } from "element-ui";

function errorLog(error) {
  // 显示提示
  Message({
    message: error.message,
    type: "error",
    duration: 10 * 1000,
  });
}
let requestConfig = {
  baseURL: "http://139.9.203.100:9600/",
  timeout: 10000,
};

const ProductAxios = axios.create(requestConfig);
ProductAxios.interceptors.request.use(
  function (config) {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
ProductAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          error.message = "未授权，请登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
        default:
          error.message = "请求超时, 并无收到来自服务器的任何返回";
          break;
      }
    }
    errorLog(error);
    return Promise.reject(error);
  }
);
export default ProductAxios;
