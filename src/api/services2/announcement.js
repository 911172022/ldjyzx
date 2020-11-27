import request from "../BaseAxios";
export default {
  // 查看公告列表
  getList(data) {
    return request({
      url: "/sys/announcement/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改公告
  editReport(data) {
    return request({
      url: "/sys/announcement/update",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 增加公告
  addReport(data) {
    return request({
      url: "/sys/announcement/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 删除公告
  deleteReport(data) {
    return request({
      url: "/sys/announcement/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
