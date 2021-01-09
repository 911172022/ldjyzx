import request from "../BaseAxios";
/* 
  档案接口
*/
export default {
  // 入库或退库（根据所选ID）
  dataBaseById(data) {
    return request({
      url: "/ArchDocument/updateWarehousingStatusA",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 入库或退库（根据所选条件）
  dataBaseByStatus(data) {
    return request({
      url: "ArchDocument/updateWarehousingStatus",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档案页面表头显示 ———— 全部档案类型
  getListHead(data) {
    return request({
      url: "sys/category/listFormHead",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档案页面表单显示————全部档案类型
  getFileForm(data) {
    return request({
      url: "/sys/category/addFormProperty",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 导出Excel————全部档案类型
  exportExcel(data) {
    return request({
      url: "/excel/export",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加档案信息————未归
  addFileForm(data) {
    return request({
      url: "/unfiled/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 未归
  getunFiledList(data) {
    return request({
      url: "/unfiled/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },

  // 查看档案详细信息
  getArchInfo(data) {
    return request({
      url: "/unfiled/getArchInfo",
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
      url: "/unfiled/destroy",
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
      url: "/unfiled/update",
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
      url: "/unfiled/updateIsDelete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
