/*
 * @Author: CiFong
 * @Date: 2020-07-28 17:30:12
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-29 15:17:23
 * @Description: 客户种类

 */
import request from "../ProductAxios";

export default {
  findConsumerType() {
    return request({
      method: "get",
      url: "/consumer-type/find-all",
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
  addConsumerType(data) {
    return request({
      method: "post",
      url: "/consumer-type/add",
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
  editConsumerType(data) {
    return request({
      method: "post",
      url: "/consumer-type/edit",
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
  delConsumerType(data) {
    return request({
      method: "post",
      url: "/consumer-type/del",
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
