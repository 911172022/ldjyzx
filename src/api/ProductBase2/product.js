/*
 * @Author: CiFong
 * @Date: 2020-07-29 10:54:21
 * @LastEditors: CiFong
 * @LastEditTime: 2020-08-06 08:55:19
 * @Description: 产品
 */
import request from "../ProductAxios";

export default {
  findProduct() {
    return request({
      method: "get",
      url: "/product/find-all",
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 0
    }).then(function(response) {
      if (response.data.CODE === "SUCCESS") {
        return response.data.RESULT;
      } else {
        throw Error(response.data.MESSAGE);
      }
    });
  },
  addProduct(data) {
    return request({
      method: "post",
      url: "/product/add",
      headers: {
        "Content-Type": "application/json"
      },
      data,
      timeout: 0
    }).then(function(response) {
      if (response.data.CODE === "SUCCESS") {
        return response.data.RESULT;
      } else {
        throw Error(response.data.MESSAGE);
      }
    });
  },
  editProduct(data) {
    return request({
      method: "post",
      url: "/product/edit",
      headers: {
        "Content-Type": "application/json"
      },
      data,
      timeout: 0
    }).then(function(response) {
      if (response.data.CODE === "SUCCESS") {
        return response.data.RESULT;
      } else {
        throw Error(response.data.MESSAGE);
      }
    });
  },
  delProduct(data) {
    return request({
      method: "post",
      url: "/product/del",
      headers: {
        "Content-Type": "application/json"
      },
      data,
      timeout: 0
    }).then(function(response) {
      if (response.data.CODE === "SUCCESS") {
        return response.data.RESULT;
      } else {
        throw Error(response.data.MESSAGE);
      }
    });
  },

  findProductIcon(id) {
    let params = { id };
    return request({
      method: "get",
      url: "/product-icon/find-one",
      headers: {
        "Content-Type": "application/json"
      },
      params,
      timeout: 0
    }).then(function(response) {
      if (response.data.CODE === "SUCCESS") {
        return response.data.RESULT;
      } else {
        throw Error(response.data.MESSAGE);
      }
    });
  },
  findProductIconByFile(id) {
    let params = { id };
    return request({
      method: "get",
      url: "/product-icon/find-one-file",
      headers: {
        "Content-Type": "application/json"
      },
      params,
      timeout: 0,
      responseType: "blob"
    }).then(function(response) {
      return response.data;
    });
  },

  updateProductIcon(id, file) {
    let data = new FormData();
    data.append("id", id);
    data.append("icon", file);
    return request({
      method: "post",
      url: "/product-icon/update",
      headers: {
        "Content-Type": "application/json"
      },
      data,
      timeout: 0
    }).then(function(response) {
      if (response.data.CODE === "SUCCESS") {
        return response.data.RESULT;
      } else {
        throw Error(response.data.MESSAGE);
      }
    });
  }
};
