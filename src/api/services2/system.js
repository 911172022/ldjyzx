import request from "../BaseAxios";
export default {
  // 增加分类
  addType(data) {
    return request({
      url: "sys/category/add",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 删除分类
  deleteType(data) {
    return request({
      url: "sys/category/delete",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看分类
  getTypeList(data) {
    return request({
      url: "sys/category/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看分类属性
  getTypeProperty(data) {
    return request({
      url: "sys/category/queryProperty",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看树状分类
  getTypeTreeList(data) {
    return request({
      url: "sys/category/treeList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改分类
  updateType(data) {
    return request({
      url: "sys/category/update",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改分类
  updateTypeProperty(data) {
    return request({
      url: "sys/category/updateProperty",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 获取菜单列表
  getMenuTreeList(data) {
    return request({
      url: "sys/menu/treeList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
};
