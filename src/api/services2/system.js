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
      data: data,
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
  // 查看类别属性
  getTypeAttr(data) {
    return request({
      url: "sys/category/queryProperty",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 添加类别号
  addTypeNum(data) {
    return request({
      url: "/sys/category/addCategoryNumber",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 修改类别号
  editTypeNum(data) {
    return request({
      url: "/sys/category/updateCategoryNumber",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 删除类别号
  deleteTypeNum(data) {
    return request({
      url: "/sys/category/deleteCategoryNumber",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看类别号列表
  getTypeNumList(data) {
    return request({
      url: "/sys/category/categoryNumber/list",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档号设置：类别档号显示
  getArchNo(data) {
    return request({
      url: "/sys/category/archNo/get",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 	档号设置：类别档号设置
  setArchNo(data) {
    return request({
      url: "/sys/category/archNo/option",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 档号设置：类别字段显示
  archNoList(data) {
    return request({
      url: "/sys/category/params/list",
      method: "post",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  },
  // 查看分类简单信息
  getSimpleList(data) {
    return request({
      url: "/sys/category/simpleList",
      method: "get",
      params: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
