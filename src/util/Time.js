/*
 * @Author: CiFong
 * @Date: 2020-07-31 16:41:26
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-31 16:53:23
 * @Description: 请输入
 */

/**
 * 換算時間
 * @param {Number} OriginalTime Sat Jan 11 2020 21:08:19 GMT+0800 (中國標準時間)
 * @return {String} 2020-01-11T21:08:19
 */
export function p(s) {
  return s < 10 ? "0" + s : s;
}
export function TimeChange(OriginalTime) {
  let NewTime =
    OriginalTime.getFullYear() +
    "-" +
    p(OriginalTime.getMonth() + 1) +
    "-" +
    p(OriginalTime.getDate()) +
    "T" +
    p(OriginalTime.getHours()) +
    ":" +
    p(OriginalTime.getMinutes()) +
    ":" +
    p(OriginalTime.getSeconds());
  return NewTime;
}
/**
 * 将 Date 转化为指定格式的String
 * @param {Date} date 要格式化的日期时间对象
 * @param {String} fmt 描述格式的字符串
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 */
export function format(date, fmt) {
  if (!date) {
    return "";
  }
  try {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    if (isNaN(date.valueOf())) {
      return "";
    }
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  } catch (err) {
    return "";
  }
}
