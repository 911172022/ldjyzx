import request from "../BaseAxios";
/* 
  档案接口
*/
export default {
  /* 资料 */
  // 修改：批量修改（根据条件所有）
  updateByOther(data) {
    return request({
      url: "/ArchData/update/batch",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改：批量修改（根据ID）
  updateById(data) {
    return request({
      url: "/ArchData/formal/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加档案信息———— 资料临时库
  addArchDataFileForm2(data) {
    return request({
      url: "/ArchData/temp/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 资料正式库
  getArchDataList(data) {
    return request({
      url: "/ArchData/formal/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 列表：档案数据显示 ———— 资料临时库
  getArchDataList2(data) {
    return request({
      url: "/ArchData/temp/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看档案详细信息
  getArchDataInfo(data) {
    return request({
      url: "/ArchData/getArchInfo",
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
      url: "/ArchData/destroy",
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
      url: "/ArchData/update",
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
      url: "/ArchData/updateIsDelete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },

  /* 审核 */
  // 批量入库:根据所选条件
  enterDatabaseByAll(data) {
    return request({
      url: "/ArchCheck/check/formal",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量入库:根据所选ID
  enterDatabaseByID(data) {
    return request({
      url: "/ArchCheck/check/formal/ids",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量退库:根据所选条件
  outDatabaseByAll(data) {
    return request({
      url: "/ArchCheck/check/temp",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 批量退库:根据所选ID
  outDatabaseByID(data) {
    return request({
      url: "/ArchCheck/check/temp/ids",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看：档案审核列表表头
  getHeadList(data) {
    return request({
      url: "/ArchCheck/headList",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看：档案审核列表
  getList(data) {
    return request({
      url: "/ArchCheck/list",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
};
