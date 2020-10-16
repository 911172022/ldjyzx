/*
 * @Author: CiFong
 * @Date: 2020-07-28 16:56:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-29 15:15:56
 * @Description: 品牌
 */
import request from "../ProductAxios";

export default {
  findBrand() {
    return request({
      method: "get",
      url: "/brand/find-all",
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
  addBrand(data) {
    return request({
      method: "post",
      url: "/brand/add",
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
  editBrand(data) {
    return request({
      method: "post",
      url: "/brand/edit",
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
  delBrand(data) {
    return request({
      method: "post",
      url: "/brand/del",
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
