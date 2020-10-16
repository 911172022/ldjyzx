/*
 * @Author: CiFong
 * @Date: 2020-07-28 17:29:41
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-29 15:17:47
 * @Description: 专业
 */
import request from "../ProductAxios";

export default {
  findSpeciality() {
    return request({
      method: "get",
      url: "/speciality/find-all",
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
  addSpeciality(data) {
    return request({
      method: "post",
      url: "/speciality/add",
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
  editSpeciality(data) {
    return request({
      method: "post",
      url: "/speciality/edit",
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
  delSpeciality(data) {
    return request({
      method: "post",
      url: "/speciality/del",
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
