/*
 * @Author: your name
 * @Date: 2020-11-25 10:10:29
 * @LastEditTime: 2021-02-01 14:59:01
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \gyy_oac:\Users\Shihx\Desktop\ldjyzx\src\api\services2\upload.js
 */
// import { Form } from "element-ui";
import request from "../BaseAxios";
export default {
  // 删除附件
  deleteUpload(data) {
    return request({
      url: "/attachment/attachment/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看附件列表
  getList(data) {
    return request({
      url: "/attachment/attachment/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 上传附件————未归
  upload(data) {
    let file = new FormData();
    file.append("file", data.file);
    file.append("categoryId", data.categoryId);
    file.append("archId", data.archId);

    return request({
      url: "/unfiled/attachment/upload",
      method: "post",
      data: file,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  // 上传附件————归档，预归
  upload2(data) {
    let file = new FormData();
    file.append("file", data.file);
    file.append("categoryId", data.categoryId);
    file.append("archId", data.archId);
    return request({
      url: "/ArchDocument/attachment/upload",
      method: "post",
      data: file,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  // 上传附件————资料
  upload3(data) {
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
};
