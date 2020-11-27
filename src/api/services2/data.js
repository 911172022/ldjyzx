import request from "../BaseAxios";
export default {
  // 修改系统数据自动备份周期
  updateExpressionType(data) {
    return request({
      url: "/sys/scheduledCron/change/expressionType",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 启动或禁用系统数据自动备份
  openStatus(data) {
    return request({
      url: "sys/scheduledCron/change/status",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 系统数据自动备份设置:type的1：启动，2：禁用，status的1：每周，2：每月
  autoBackUp(data) {
    return request({
      url: "sys/scheduledCron/get",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 删除备份
  deleteBackUp(data) {
    return request({
      url: "/sys/backup/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查询数据备份的列表
  getBackUpList(data) {
    return request({
      url: "/sys/backup/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 恢复备份
  restore(data) {
    return request({
      url: "/sys/backup/restore",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 手动备份
  run(data) {
    return request({
      url: "/sys/backup/run",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
};
