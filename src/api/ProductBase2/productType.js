/*
 * @Author: CiFong
 * @Date: 2020-07-28 17:30:36
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-29 15:16:28
 * @Description: 产品类型

 */
import request from "../ProductAxios";

export default {
  findProductType() {
    return request({
      method: "get",
      url: "/product-type/find-all",
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
  addProductType(data) {
    return request({
      method: "post",
      url: "/product-type/add",
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
  editProductType(data) {
    return request({
      method: "post",
      url: "/product-type/edit",
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
  delProductType(data) {
    return request({
      method: "post",
      url: "/product-type/del",
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
