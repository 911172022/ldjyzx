import request from "../BaseAxios";
export default {
  getFileForm4(data) {
    return request({
      url: "/ArchDocument/addFormProperty",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加档案信息———— 正式库
  addFileForm(data) {
    return request({
      url: "/ArchDocument/formal/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 正式库
  getunFiledList(data) {
    return request({
      url: "/ArchDocument/formal/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加档案信息———— 临时库
  addFileForm2(data) {
    return request({
      url: "/ArchDocument/temp/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 临时库
  getunFiledList2(data) {
    return request({
      url: "/ArchDocument/temp/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档案页面表头显示
  getunFiledListHead4(data) {
    return request({
      url: "/ArchDocument/listFormHead",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看档案详细信息
  getArchInfo4(data) {
    return request({
      url: "/ArchDocument/getArchInfo",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 销毁档案
  deleteArch4(data) {
    return request({
      url: "/ArchDocument/destroy",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改档案信息
  updateArch4(data) {
    return request({
      url: "/ArchDocument/update",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 逻辑删除
  updateIsDelete4(data) {
    return request({
      url: "/ArchDocument/updateIsDelete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
};
