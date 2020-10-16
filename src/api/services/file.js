import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'


export default {
  //上传第一块文件块时触发，在上传文件，以及替换文件时使用
  beforeUploadFile(ObjectKeyword, ServerFileName, CreateDate, ModifyDate, fileSize, MD5) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.FileController',
      A: 'BeforeUploadFile',
      sid,
      ObjectKeyword,
      ServerFileName,
      CreateDate,
      ModifyDate,
      fileSize,
      MD5
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //继续上传文件块，这里要根据情况再修改一下
  //ServerFullFileName:从beforeUploadFile函数获取到
  //Files:文件块
  uploadFile(ServerFullFileName, Files) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.CDMS.WebApi.FileController')
    data.append("A", 'UploadFile')
    data.append("ServerFullFileName", ServerFullFileName)
    data.append("Files", Files)
    return request({
      url: `WebApi/Post`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  },
  // menuUpload 测试
  // uploadFile(data) {
  //   return request({
  //     url: `WebApi/Post`,
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     },
  //     data
  //   })
  // },
  uploadFile2(ServerFullFileName, Files, chunks, chunk) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.CDMS.WebApi.FileController')
    data.append("A", 'UploadFile')
    data.append("ServerFullFileName", ServerFullFileName)
    data.append("Files", Files)
    data.append("chunks", chunks)
    data.append("chunk", chunk)
    return request({
      url: `WebApi/Post`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  },
  uploadFile3(ServerFullFileName, Files) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.CDMS.WebApi.FileController')
    data.append("A", 'UploadFile')
    data.append("ServerFullFileName", ServerFullFileName)
    data.append("Files", Files)
    return request({
      url: `WebApi/Post`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  },
  //文件上传完毕后触发事件
  //ServerFullFileName:从beforeUploadFile函数获取到
  afterUploadFile(DocKeyword, ServerFullFileName) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.FileController',
      A: 'AfterUploadFile',
      sid,
      DocKeyword,
      ServerFullFileName
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
