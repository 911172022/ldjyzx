import uploadRequest from './uploadHttp'
import request from '../../../api/BaseAxios'

import Qs from 'qs'
import store from '@/store'

export default {
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
    // 上传文件接口，ServerFullFileName 在beforeUploadFile那里获取
    // Files 文件切块的 blob 数据
    // chunks 切块的总块数
    // chunk 现在上传的是第几块
    uploadFile(ServerFullFileName, Files, chunks, chunk, onUploadProgress=() => {}) {
        const sid = store.getters.sid
        let data = new FormData()
        data.append("sid", sid)
        data.append("C", 'AVEVA.CDMS.WebApi.FileController')
        data.append("A", 'UploadFile')
        data.append("ServerFullFileName", ServerFullFileName)
        data.append("Files", Files)
        data.append("chunks", chunks)
        data.append("chunk", chunk)
        return uploadRequest({
            url: `WebApi/Post`,
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data,
            onUploadProgress: onUploadProgress
        })
    },
    //文件上传完毕后触发事件
    // ServerFullFileName:从beforeUploadFile函数获取到
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
}