import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'


export default {
  /**
   * 获取产品种类列表
   * @param {String} parentCategoryKeyword 一级种类的关键字，如果是空，就返回所有一级种类
   */
  getProductCategoryList(parentCategoryKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.I3VMS.I3VTD_Plugins.Product',
      A: 'GetProductCategoryList',
      sid,
      parentCategoryKeyword
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  /**
   * 添加产品种类
   * @param {String} parentKeyword 一级种类的关键字，如果是空，就建立一级种类
   * @param {String} productName 产品种类名称
   */
  newProductCategory(parentKeyword, productName) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.I3VMS.I3VTD_Plugins.Product',
      A: 'NewProductCategory',
      sid,
      parentKeyword,
      productName
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  /**
   * 修改产品种类
   * @param {String} projectKeyword 目录 Keyword
   * @param {String} projectAttrJson 修改名称
   * ex: [{ name: "projectName", value: '修改名称' }]
   *
   * 修改个别化的参数
   * ex: //个别化行业名称 "II_IndustryName"
        //推荐指数 "II_Recommended"
        //所属部门 "II_Department"
        //联系电话 "II_ContactNumber"
        //产品经理 "II_ProductManager"
        //软件价格 "II_ProductPrice"
        //竞品分析 "II_ProductComparison"
        //产品特性 "II_ProductFeatures"
        //案例附件 "II_CaseAttachment"
        //资料附件 "II_AdditionalDocument"
   */
  updateProjectAttr(projectKeyword, projectAttrJson) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.CDMS.WebApi.ProjectController')
    data.append("A", 'UpdateProjectAttr')
    data.append("projectKeyword", projectKeyword)
    data.append("projectAttrJson", JSON.stringify(projectAttrJson))
    return request({
      url: `WebApi/post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  },
  /**
   * 删除产品种类、产品
   * @param {String} ProjectKeyword 目录 Keyword
   * @param {boolean} sureDel true 确定删除
   */
  delProject(ProjectKeyword, sureDel) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'DelProject',
      sid,
      ProjectKeyword,
      sureDel
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  /**
   * 获取行业种类列表
   * @param {String} parentCategoryKeyword 一级种类的关键字，如果是空，就返回所有一级种类
   */
  getIndustryCategoryList(parentCategoryKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.I3VMS.I3VTD_Plugins.Industry',
      A: 'GetIndustryCategoryList',
      sid,
      parentCategoryKeyword
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  /**
   * 添加行业种类
   * @param {String} parentKeyword 一级种类的关键字，如果是空，就建立一级种类
   * @param {String} industryName 行业种种类名称
   */
  newIndustryCategory(parentKeyword, industryName) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.I3VMS.I3VTD_Plugins.Industry',
      A: 'NewIndustryCategory',
      sid,
      parentKeyword,
      industryName
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  /**
   *
   * @param {String} filter 搜索
   * @param {String} productLabelList 产品种类
   * @param {String} industryLabelList 行业种类
   * @param {Number} limit 每页显示条目个数
   * @param {Number} page 当前页
   */
  getProductList(filter, productLabelList, industryLabelList, limit, page) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.I3VMS.I3VTD_Plugins.Product',
      A: 'GetProductList',
      sid,
      filter,
      productLabelList,
      industryLabelList,
      limit,
      page
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  /**
   * 获取行业个别化列表
   * @param {*} productKeyword 产品关键字
   * @param {*} parentIndividuationKeyword 一级分类为空，如果不是一级行业个别化分类，就填写上一级分类的关键字
   */
  getIndividuationList(productKeyword, parentIndividuationKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.I3VMS.I3VTD_Plugins.Individuation',
      A: 'GetIndividuationList',
      sid,
      productKeyword,
      parentIndividuationKeyword
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  /**
   *
   * @param {String} productKeyword 产品关键字
   * @param {String} primaryIndustryKeyword 一级行业分类
   * @param {String} secondaryIndustryKeyword 二级行业分类
   * @param {Array} attrJson 传 JSON
   * //个别化行业名称 "IndustryName"
    //产品经理 "ProductManager"
    //所属部门 "Department"
    //联系电话 "ContactNumber"
    //推荐指数 "Recommended"
    //软件价格 "ProductPrice"
    //产品特性 "ProductFeatures"
    //竞品分析 "ProductComparison"
    //案例附件 "CaseAttachment"
    //资料附件 "AdditionalDocument"
   */
  newIndividuation(productKeyword, primaryIndustryKeyword, secondaryIndustryKeyword, attrJson) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.I3VMS.I3VTD_Plugins.Individuation')
    data.append("A", 'NewIndividuation')
    data.append("productKeyword", productKeyword)
    data.append("primaryIndustryKeyword", primaryIndustryKeyword)
    data.append("secondaryIndustryKeyword", secondaryIndustryKeyword)
    data.append("attrJson", JSON.stringify(attrJson))
    return request({
      url: `WebApi/post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  },
  /**
   * 新增产品信息
   * @param {String} parentKeyword 产品种类的关键字
   * @param {String} productCode 产品名称 (不知道干嘛用的)
   * @param {Array} productAttrJson 传 JSON
   * //图片链接 "Image"
    //产品英文名称"ProductEnName"
    //产品中文名称"ProductCnName"
    //产品介绍"ProductDescription"
    //行业细分"IndustryBreakdown"
    //产品经理"ProductManager"
    //所属部门"Department"
    //联系电话"ContactNumber"
    //软件价格"ProductPrice"
    //适用对象"Suitable"
    //软件对比"ProductComparison"
    //客户案例"CustomerCase"
    //案例附件"CaseAttachment"
    //资料附件"AdditionalDocument"
    //产品特性"ProductFeatures"
    //适应行业"APPLICABLEINDUSTRY"
   */
  newProduct(parentKeyword, productCode, productAttrJson) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.I3VMS.I3VTD_Plugins.Product')
    data.append("A", 'NewProduct')
    data.append("parentKeyword", parentKeyword)
    data.append("productCode", productCode)
    data.append("productAttrJson", JSON.stringify(productAttrJson))
    return request({
      url: `WebApi/post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  },
  /**
   * 获取产品的所有行业个别化列表
   * @param {String} productKeyword 产品关键字 (个别化 ID)
   */
  getAllIndividuationList(productKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.I3VMS.I3VTD_Plugins.Individuation',
      A: 'GetAllIndividuationList',
      sid,
      productKeyword
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  /**
   * 获取产品信息和行业个别化（目录）
   * @param {String} productKeyword 产品关键字 (个别化 ID)
   */
  getProduct(productKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: "AVEVA.I3VMS.I3VTD_Plugins.Product",
      A: 'GetProduct',
      sid,
      productKeyword
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  /**
   * 修改产品信息
   * @param {String} productKeyword 产品关键字
   * @param {String} productCode 产品名称
   * @param {Array} productAttrJson 
   * //图片链接 "Image"
     //产品英文名称"ProductEnName"
     //产品中文名称"ProductCnName"
     //产品介绍"ProductDescription"
     //行业细分"IndustryBreakdown"
     //产品经理"ProductManager"
     //所属部门"Department"
     //联系电话"ContactNumber"
     //软件价格"ProductPrice"
     //适用对象"Suitable"
     //软件对比"ProductComparison"
     //客户案例"CustomerCase"
     //案例附件"CaseAttachment"
     //资料附件"AdditionalDocument"
     //产品特性"ProductFeatures"
     //适应行业"APPLICABLEINDUSTRY"
   * @param {String} parentKeyword 行业分类
   */
  updateProduct(productKeyword, productCode, productAttrJson, parentKeyword) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.I3VMS.I3VTD_Plugins.Product')
    data.append("A", 'UpdateProduct')
    data.append("productKeyword", productKeyword)
    data.append("productCode", productCode)
    data.append("productAttrJson", JSON.stringify(productAttrJson))
    data.append("parentKeyword", parentKeyword)
    return request({
      url: `WebApi/post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  },
  /**
   * 
   * @param {String} individuationKeyword  行业个别化关键字
   * @param {String} primaryIndustryKeyword 一级行业分类
   * @param {String} secondaryIndustryKeyword 二级行业分类
   * @param {Array} attrJson 
   * //个别化行业名称 "IndustryName"
    //推荐指数 "Recommended"
    //所属部门 "Department"
    //联系电话 "ContactNumber"
    //产品经理 "ProductManager"
    //软件价格 "ProductPrice"
    //竞品分析 "ProductComparison"
    //产品特性 "ProductFeatures"
    //案例附件 "CaseAttachment"
    //资料附件 "AdditionalDocument"
   */
  updateIndividuation(individuationKeyword, primaryIndustryKeyword, secondaryIndustryKeyword, attrJson) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.I3VMS.I3VTD_Plugins.Individuation')
    data.append("A", 'UpdateIndividuation')
    data.append("individuationKeyword", individuationKeyword)
    data.append("primaryIndustryKeyword", primaryIndustryKeyword)
    data.append("secondaryIndustryKeyword", secondaryIndustryKeyword)
    data.append("attrJson", JSON.stringify(attrJson))
    return request({
      url: `WebApi/post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  },
  /**
   * 获取指定的行业个别化信息
   * @param {*} individuationKeyword 行业个别化目录关键字
   */
  getIndividuation(individuationKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: "AVEVA.I3VMS.I3VTD_Plugins.Individuation",
      A: 'GetIndividuation',
      sid,
      individuationKeyword
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
