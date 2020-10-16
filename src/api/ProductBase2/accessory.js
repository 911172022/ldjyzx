/*
 * @Author: CiFong
 * @Date: 2020-07-28 16:56:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-30 17:40:34
 * @Description: 品牌
 */
import request from "../ProductAxios";

export default {
  findAccessory() {
    return request({
      method: "get",
      url: "/accessory/find-all",
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
  addAccessory(data) {
    return request({
      method: "post",
      url: "/accessory/add",
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
  editAccessory(data) {
    return request({
      method: "post",
      url: "/accessory/edit",
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
  delAccessory(data) {
    return request({
      method: "post",
      url: "/accessory/del",
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
  addAccessoryToProduct(data) {
    return request({
      method: "post",
      url: "/accessory/add-to-product",
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
