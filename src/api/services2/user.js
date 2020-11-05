import request from "../BaseAxios";

export default {
  // 添加用户
  addUser(data) {
    return request({
      url: "sys/user/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 获取用户列表
  getUserList(data) {
    return request({
      url: "sys/user/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 删除用户
  deleteUser(data) {
    return request({
      url: "sys/user/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 获取用户信息
  getUser(data) {
    return request({
      url: "sys/user/get",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改个人密码 ---- 个人中心处
  updatePwd(data) {
    return request({
      url: "/sys/user/updatePwd",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 获取个人信息 ---- 个人中心处
  getMyInfo(data) {
    return request({
      url: "/sys/user/getMyInfo",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 编辑用户信息
  updateUserInfo(data) {
    return request({
      url: "/sys/user/update",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 获取单位内用户列表
  getDepartmentUserList(data) {
    return request({
      url: "/sys/department/userList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 获取单位树列表
  getDepartmentList(data) {
    return request({
      url: "/sys/department/treeList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 增加单位
  addDepartment(data) {
    return request({
      url: "/sys/department/add",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 删除单位
  deleteDepartment(data) {
    return request({
      url: "/sys/department/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改单位
  updateDepartment(data) {
    return request({
      url: "/sys/department/update",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 移除用户出单位
  deleteUserByDepartment(data) {
    return request({
      url: "/sys/department/deleteUser",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加用户出单位
  addUserByDepartment(data) {
    return request({
      url: "/sys/department/addUser",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },

  // 获取用户组内用户列表
  getGroupUserList(data) {
    return request({
      url: "/sys/group/userList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 获取用户组树列表
  getGroupList(data) {
    return request({
      url: "/sys/group/treeList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 增加用户组
  addGroup(data) {
    return request({
      url: "/sys/group/add",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 删除用户组
  deleteGroup(data) {
    return request({
      url: "/sys/group/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改用户组
  updateGroup(data) {
    return request({
      url: "/sys/group/update",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 移除用户出用户组
  deleteUserByGroup(data) {
    return request({
      url: "/sys/group/deleteUser",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加用户出用户组
  addUserByGroup(data) {
    return request({
      url: "/sys/group/addUser",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
