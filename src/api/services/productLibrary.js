import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'


export default {
  // 获取产品分类（目录）
  getProductCategoryList(parentCategoryKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.I3VMS.I3VTD_Plugins.Product',
      A: 'GetProductCategoryList',
      sid,
      parentCategoryKeyword: parentCategoryKeyword
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // 获取行业分类
  getIndustryCategoryList(parentCategoryKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.I3VMS.I3VTD_Plugins.Industry',
      A: 'GetIndustryCategoryList',
      sid,
      parentCategoryKeyword: parentCategoryKeyword
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
