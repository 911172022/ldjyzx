/*
 * @Author: CiFong
 * @Date: 2020-07-28 16:56:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-31 10:18:58
 * @Description: 品牌
 */
import request from "../ProductAxios";

export default {
  findHyperlink() {
    return request({
      method: "get",
      url: "/hyperlink/find-all",
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
  addHyperlink(data) {
    return request({
      method: "post",
      url: "/hyperlink/add",
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
  editHyperlink(data) {
    return request({
      method: "post",
      url: "/hyperlink/edit",
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
  delHyperlink(data) {
    return request({
      method: "post",
      url: "/hyperlink/del",
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
  addHyperlinkToProduct(data) {
    return request({
      method: "post",
      url: "/hyperlink/add-to-product",
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
