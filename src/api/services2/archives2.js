import request from "../BaseAxios";
export default {
  // 档案开放状态（根据所选条件）
  updateOpenStatus(data) {
    return request({
      url: "/ArchDocument/updateOpenStatus",
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
      url: "/ArchDocument/updateOpenStatusByIds",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量修改（根据所选ID）———— 归档
  updateBatchSelect(data) {
    return request({
      url: "ArchDocument/update/batch/select",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量修改（根据条件所有）———— 归档
  updateBatch(data) {
    return request({
      url: "ArchDocument/update/batch",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加档案信息———— 正式库归档
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
  // 列表：档案数据显示 ———— 正式库归档
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
  // 添加档案信息———— 临时库归档
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
  // 列表：档案数据显示 ———— 临时库归档
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
  // 查看档案详细信息 ———— 归档
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
  // 销毁档案 ———— 归档
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
  // 修改档案信息 ———— 归档
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
  // 逻辑删除 ———— 归档
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
  // 添加档案信息———— 正式库案卷
  addFileForm3(data) {
    return request({
      url: "/ArchFiles/formal/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 正式库案卷
  getunFiledList3(data) {
    return request({
      url: "/ArchFiles/formal/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加档案信息———— 临时库案卷
  addFileForm4(data) {
    return request({
      url: "/ArchFiles/temp/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 临时库案卷
  getunFiledList23(data) {
    return request({
      url: "/ArchFiles/temp/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看档案详细信息 ———— 案卷
  getArchInfo3(data) {
    return request({
      url: "/ArchFiles/getArchInfo",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 销毁档案 ———— 案卷
  deleteArch3(data) {
    return request({
      url: "/ArchFiles/destroy",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改档案信息 ———— 案卷
  updateArch3(data) {
    return request({
      url: "/ArchFiles/update",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 逻辑删除 ———— 案卷
  updateIsDelete3(data) {
    return request({
      url: "/ArchFiles/updateIsDelete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
