/*
 * @Author: your name
 * @Date: 2020-12-16 10:01:43
 * @LastEditTime: 2020-12-23 16:46:38
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \gyy_oac:\Users\Shihx\Desktop\ldjyzx\src\api\services2\openList.js
 */
import request from "../BaseAxios";
export default {
  // 查看开放列表
  getList(data) {
    return request({
      url: "ArchOpen/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看开放列表 ---- 表头
  getListHead(data) {
    return request({
      url: "/ArchOpen/headList",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量取消开放:根据所选ID
  closeByID(data) {
    return request({
      url: "/ArchOpen/check/temp/ids",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量取消开放:根据所选条件
  closeByOther(data) {
    return request({
      url: "/ArchOpen/check/temp",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量开放:根据所选ID
  openByID(data) {
    return request({
      url: "/ArchOpen/check/formal/ids",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量开放:根据所选条件
  openByOther(data) {
    return request({
      url: "/ArchOpen/check/formal",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
}