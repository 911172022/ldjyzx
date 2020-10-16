/**
   * 判断文档类型
   * @param {String} title 版本
   * @return {String} icon 路径
   */

export const VersionIcon = (title, status) => {
  let StringtoBig = ''
  if (status === 'RefDocList') {
    StringtoBig = 'RefDoc'
  } else if (status === 'VersionList') {
    let regex = /[A-z]/g
    let arr = title.match(regex)
    if (!arr) StringtoBig = 'noNum'
    else if (arr.length > 1) StringtoBig = 'noNum'
    else StringtoBig = title.toUpperCase()
  }
  // regex 取出刮号内版本
  // toUpperCase 转大写
  let imgUrl = require(`@/assets/version/${StringtoBig}.png`)
  return imgUrl
}
