import request from "../BaseAxios";
/* 
  档案接口
*/
export default {
  // 档案页面表单显示———— 审核
  getFileForm(data) {
    return request({
      url: "/ArchFiles/check/addFormProperty",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加档案信息———— 审核
  addFileForm(data) {
    return request({
      url: "/ArchFiles/check/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 审核
  getunFiledList(data) {
    return request({
      url: "/ArchFiles/check/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档案页面表头显示 ———— 审核
  getunFiledListHead(data) {
    return request({
      url: "/ArchFiles/check/listFormHead",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看档案详细信息
  getArchInfo(data) {
    return request({
      url: "/ArchFiles/check/getArchInfo",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 销毁档案
  deleteArch(data) {
    return request({
      url: "/ArchFiles/check/destroy",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改档案信息
  updateArch(data) {
    return request({
      url: "/ArchFiles/check/update",
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
      url: "/ArchFiles/check/updateIsDelete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },

  /* 资料 */
  // 档案页面表单显示———— 审核
  getFileForm3(data) {
    return request({
      url: "/ArchData/check/addFormProperty",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加档案信息———— 审核
  addFileForm3(data) {
    return request({
      url: "/ArchData/check/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 审核
  getunFiledList3(data) {
    return request({
      url: "/ArchData/check/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档案页面表头显示 ———— 审核
  getunFiledListHead3(data) {
    return request({
      url: "/ArchData/check/listFormHead",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看档案详细信息
  getArchInfo3(data) {
    return request({
      url: "/ArchData/check/getArchInfo",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 销毁档案
  deleteArch3(data) {
    return request({
      url: "/ArchData/check/destroy",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改档案信息
  updateArch3(data) {
    return request({
      url: "/ArchData/check/update",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 逻辑删除
  updateIsDelete3(data) {
    return request({
      url: "/ArchData/check/updateIsDelete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },

  /* 归档文件 */
  getFileForm4(data) {
    return request({
      url: "/ArchDocument/check/addFormProperty",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加档案信息———— 审核
  addFileForm4(data) {
    return request({
      url: "/ArchDocument/check/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 审核
  getunFiledList4(data) {
    return request({
      url: "/ArchDocument/check/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档案页面表头显示 ———— 审核
  getunFiledListHead4(data) {
    return request({
      url: "/ArchDocument/check/listFormHead",
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
      url: "/ArchDocument/check/getArchInfo",
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
      url: "/ArchDocument/check/destroy",
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
      url: "/ArchDocument/check/update",
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
      url: "/ArchDocument/check/updateIsDelete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
};
