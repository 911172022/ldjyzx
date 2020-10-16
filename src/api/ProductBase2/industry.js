/*
 * @Author: CiFong
 * @Date: 2020-07-28 17:29:28
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-29 15:16:05
 * @Description: 行业

 */
import request from "../ProductAxios";

export default {
  findIndustry() {
    return request({
      method: "get",
      url: "/industry/find-all",
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
  addIndustry(data) {
    return request({
      method: "post",
      url: "/industry/add",
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
  editIndustry(data) {
    return request({
      method: "post",
      url: "/industry/edit",
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
  delIndustry(data) {
    return request({
      method: "post",
      url: "/industry/del",
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
