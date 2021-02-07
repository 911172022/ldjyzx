/*
 * @Author: your name
 * @Date: 2021-01-19 16:19:38
 * @LastEditTime: 2021-01-19 17:34:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gyy_oac:\Users\Shihx\Desktop\ldjyzx\src\api\services2\echart.js
 */
import request from "../BaseAxios";
export default {
  // 档案模块总数（未归模块总数、 归档模块总数、预归档模块总数）
  getAllModelTotal(data) {
    return request({
      url: "/sys/statistics/getAllModelTotal",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 文书档案数量二维表格图 （根据年份 -期限 二维表格图）
  getWenshuTable(data) {
    return request({
      url: "/sys/statistics/getWenshuTable",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 归档模块 各数量
  getFileInfoTotalList(data) {
    return request({
      url: "/sys/statistics/getFileInfoTotalList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 入库统计
  getWarehousingTotalList(data) {
    return request({
      url: "/sys/statistics/getWarehousingTotalList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 开放利用统计
  getOpenTotalList(data) {
    return request({
      url: "/sys/statistics/getOpenTotalList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
};
