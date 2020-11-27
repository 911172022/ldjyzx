import request from "../BaseAxios";
export default {
  // 查看全宗号列表
  getNoList(data) {
    return request({
      url: "/sys/generalArchive/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改全宗号
  editNo(data) {
    return request({
      url: "/sys/generalArchive/update",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 增加全宗号
  addNo(data) {
    return request({
      url: "/sys/generalArchive/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 删除全宗号
  deleteNo(data) {
    return request({
      url: "/sys/generalArchive/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
};
