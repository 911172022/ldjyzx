import { Form } from "element-ui";
import request from "../BaseAxios";
export default {
  // 删除附件————未归
  deleteUpload(data) {
    return request({
      url: "/unfiled/attachment/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看附件列表————未归
  getList(data) {
    return request({
      url: "/unfiled/attachment/list",
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
  // 删除附件————归档
  deleteUpload2(data) {
    return request({
      url: "ArchDocument/attachment/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看附件列表————归档
  getList2(data) {
    return request({
      url: "/ArchDocument/attachment/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 上传附件————归档
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
};
