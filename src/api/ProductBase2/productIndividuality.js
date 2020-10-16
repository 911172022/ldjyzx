/*
 * @Author: CiFong
 * @Date: 2020-07-29 11:26:32
 * @LastEditors: CiFong
 * @LastEditTime: 2020-08-24 10:24:45
 * @Description: 请输入
 */

import request from "../ProductAxios";

export default {
  findproductIndividuality(id) {
    let params = { productId: id };
    return request({
      method: "get",
      url: "/product-individuality/find-by-product-id",
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
  addproductIndividuality(data) {
    return request({
      method: "post",
      url: "/product-individuality/add",
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
  editproductIndividuality(data) {
    return request({
      method: "post",
      url: "/product-individuality/edit",
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
  delproductIndividuality(data) {
    return request({
      method: "post",
      url: "product-individuality/del",
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

  addProductIndividualityByPic(pid, file) {
    let data = new FormData();
    data.append("pid", pid);
    data.append("pic", file);
    return request({
      method: "post",
      url: "/product-individuality-pic/add",
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
  findProductIndividualityByPid(pid) {
    return request({
      method: "get",
      url: "/product-individuality-pic/find-by-pid",
      headers: {
        "Content-Type": "application/json"
      },
      params: { pid },
      timeout: 0
    }).then(function(response) {
      if (response.data.CODE === "SUCCESS") {
        return response.data.RESULT;
      } else {
        throw Error(response.data.MESSAGE);
      }
    });
  },
  findProductIndividualityByPic(id) {
    return request({
      method: "get",
      url: "/product-individuality-pic/find-one-file",
      headers: {
        "Content-Type": "application/json"
      },
      params: { id },
      timeout: 0,
      responseType: "blob"
    }).then(function(response) {
      return response.data;
    });
  },
  deldProductIndividualityByPic(id) {
    return request({
      method: "post",
      url: "/product-individuality-pic/del",
      headers: {
        "Content-Type": "application/json"
      },
      data: { id },
      timeout: 0
    }).then(function(response) {
      if (response.data.CODE === "SUCCESS") {
        return response.data.RESULT;
      } else {
        throw Error(response.data.MESSAGE);
      }
    });
  },
  updateProductIndividualityByPic(id, file) {
    return request({
      method: "post",
      url: "/product-individuality-pic/update",
      headers: {
        "Content-Type": "application/json"
      },
      data: { id, pic: file },
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
