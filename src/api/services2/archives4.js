/*
 * @Author: ZOUYUE
 * @Date: 2020-12-30 15:46:24
 * @LastEditTime: 2021-01-05 14:24:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gyy_oac:\Users\Shihx\Desktop\ldjyzx\src\api\services2\archives4.js
 */
import request from "../BaseAxios";
export default {
  /* 卷内管理 */
  // 上传附件
  upload(data) {
    let file = new FormData();
    file.append("file", data.file);
    file.append("categoryId", data.categoryId);
    file.append("archId", data.archId);
    return request({
      url: "/ArchData/attachment/upload",
      method: "post",
      data: file,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  // 销毁档案
  destroyFile(data) {
    return request({
      url: "/files/catalog/destroy",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查重：档案查重(未完成)
  checkRepeat(data) {
    return request({
      url: "/files/catalog/duplicateCheck",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 在案卷中添加卷内信息
  addInfoInAnjuan(data) {
    return request({
      url: "/files/catalog/files/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 案卷内的卷内信息列表
  listInAnjuan(data) {
    return request({
      url: "/files/catalog/files/list",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 案卷内的卷内信息表头列表
  headListInAnjuan(data) {
    return request({
      url: "/files/catalog/files/head",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 正式库添加：添加档案信息
  addFileInfo(data) {
    return request({
      url: "/files/catalog/formal/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 正式库列表：档案数据显示
  getList(data) {
    return request({
      url: "/files/catalog/formal/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 	临时库添加：添加档案信息
  addFileInfo2(data) {
    return request({
      url: "/files/catalog/temp/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 	临时库列表：档案数据显示
  getList2(data) {
    return request({
      url: "/files/catalog/temp/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看档案详细信息
  getFileInfo(data) {
    return request({
      url: "/files/catalog/getArchInfo",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改档案信息
  updateFileInfo(data) {
    return request({
      url: "/files/catalog/update",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量修改（根据条件所有）
  updateByOther(data) {
    return request({
      url: "/files/catalog/update/batch",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量修改（根据所选ID）
  updateById(data) {
    return request({
      url: "/files/catalog/update/batch/select",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 逻辑删除
  updateIsDelete(data) {
    return request({
      url: "/files/catalog/updateIsDelete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档案开放状态（根据所选条件）
  updateOpenStatus(data) {
    return request({
      url: "/files/catalog/updateOpenStatus",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档案开放状态（根据所选ID）
  updateOpenStatusByIds(data) {
    return request({
      url: "/files/catalog/updateOpenStatusByIds",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 入库或退库（根据所选条件）
  updateWarehousingStatus(data) {
    return request({
      url: "/files/catalog/updateWarehousingStatus",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 入库或退库（根据所选ID）
  updateWarehousingById(data) {
    return request({
      url: "/files/catalog/updateWarehousingStatusA",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
