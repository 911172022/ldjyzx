import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'


export default {
  //获取文档列表
  // sort, start
  getDocList(ProjectKeyWord, filterJson, page, limit) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'GetDocList',
      sid,
      ProjectKeyWord,
      filterJson,
      page,
      limit
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //根据DOC的Keyword返回一个Doc基本属性
  getDocBaseAttr(DocKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'GetDocBaseAttrByKeyword',
      sid,
      DocKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //根据DOC的Keyword返回一个Doc附加属性
  getDocAttrData(DocKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'GetDocAttrDataByKeyword',
      sid,
      DocKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //创建Doc
  createDoc(projectKeyword, docAttrJson) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'CreateDoc',
      sid,
      projectKeyword,
      docAttrJson: JSON.stringify(docAttrJson)
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取doc属性,在调用文档的“新建文档”菜单和“编辑属性”菜单，初始化表单时使用
  //action：操作类型，"ModiDoc":修改文档,"CreateDoc":创建文档
  getDocAttr(action, DocKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'GetDocAttr',
      sid,
      action,
      DocKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //删除文档对象,传Project是因为要判断doc是否是快捷方式
  deleteDoc(ProjectKeyword, DocKeyword, sureDel) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'DeleteDoc',
      sid,
      ProjectKeyword,
      DocKeyword,
      sureDel
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //更新doc属性
  //docAttrJson: 文档属性，附加属性列表，每个JObject包含："name"，"value","attrtype"三个属性。
  //"attrtype"属性的值为""(空的字符串)时，name有以下值：docCode(Doc代码)，docDesc(Doc描述)， tempDefnId(模板)；
  //当"attrtype"属性的值为"attrData"(附加属性)时,"name"为附加属性的代码
  updateDocAttr(docKeyword, docAttrJson) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'UpdateDocAttr',
      sid,
      docKeyword,
      docAttrJson: JSON.stringify(docAttrJson)
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //创建Doc前的事件
  // 判斷是否有重複文件
  beforeCreateDoc(ProjectKeyword, FileName) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'BeforeCreateDoc',
      sid,
      ProjectKeyword,
      FileName
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //处理新建Doc后的事件
  afterCreateNewDocEvent(DocKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'AfterCreateNewDocEvent',
      sid,
      DocKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //文档下载
  fileDownload(DocKeyword, RefDocKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'FileDownload',
      sid,
      DocKeyword,
      RefDocKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取文档的用户和用户组权限列表
  getDocRightList(DocKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'GetDocRightList',
      sid,
      DocKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //设置Doc权限
  setDocRightList(DocKeyword, rightAttrJson) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'SetDocRightList',
      sid,
      DocKeyword,
      rightAttrJson: JSON.stringify(rightAttrJson)
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取文档的参考文件-版本文件-附加文件列表
  getAttachFiles(DocKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'GetAttachFiles',
      sid,
      DocKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // confirmUpgrade 第一次上传为 ""
  // confirmUpgrade 第二次上传当值是"true"，就升版文件，当值时"false"，就覆盖同名文件
  CreateDocByFileName(projectKeyword, fileName, confirmUpgrade, bAutoCode) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'CreateDocByFileName',
      sid,
      projectKeyword,
      fileName,
      confirmUpgrade,
      bAutoCode
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //预览文档
  previewDoc(DocKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DocController',
      A: 'PreviewDoc',
      sid,
      DocKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // 2020.4.5-1
  //  新建Bos模型
  CreateBosModel(projectKeyWord, projectCode, projectDesc, projectKey, modelKey) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: "AVEVA.I3VMS.I3VTD_Plugins.BosModel",
      A: "New",
      sid,
      projectCode: projectCode,
      parentProjectKeyword: projectKeyWord,
      projectDesc: projectDesc,
      projectAttrJson: JSON.stringify([
        {
          "name": "bosProjectKey",
          "value": projectKey,
        },
        {
          "name": "bosModelKey",
          "value": modelKey
        }
      ])
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // 2020.4.5-1
  // 查询文件夹是否有Bos模型
  getDocBosModel(projectKeyWord) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'AfterSelectProjectItemEvent',
      sid,
      projectKeyword: projectKeyWord,
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
