/*
 * @Author: your name
 * @Date: 2020-12-29 10:06:51
 * @LastEditTime: 2020-12-29 10:41:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gyy_oac:\Users\Shihx\Desktop\ldjyzx\src\api\services2\searchSystem.js
 */
import request from "../BaseAxios";
export default {
  // 读取头部标题
  getHeadList(data) {
    return request({
      url: "/search/index/head/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 读取数据列表
  getList(data) {
    return request({
      url: "/search/index/data/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 根据ID读取档案数据
  getInfoById(data) {
    return request({
      url: "/search/index/info/get",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 读取高级检索的字段
  getHighSearchField(data) {
    return request({
      url: "/search/index/condition/advanced",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 获取条件分类
  getCategoryList(data) {
    return request({
      url: "/search/index/category/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加收藏
  addData(data) {
    return request({
      url: "/search/collect/add",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 删除收藏
  deleteData(data) {
    return request({
      url: "/search/collect/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 获取收藏列表
  getCollectList(data) {
    return request({
      url: "/search/collect/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
