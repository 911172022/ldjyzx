import request from '@/api/BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
    // 创建发文单
    sendDocument(ProjectKeyWord, docAttrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Document',
            A: 'SendDocument',
            sid,
            ProjectKeyWord,
            docAttrJson
        })
        return request({
            url: `WebApi/post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    },
    // 发起发文流程 
    documentStartWorkFlow(docKeyWord, docList) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Document',
            A: 'DocumentStartWorkFlow',
            sid,
            docKeyWord,
            docList
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 获取创建发文单表单的默认配置 
    getSendDocumentDefault(ProjectKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Document',
            A: 'GetSendDocumentDefault',
            sid,
            ProjectKeyword,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    // 获取创建收文单表单的默认配置 
    onBeforeFileAddEvent(ProjectKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Document',
            A: 'OnBeforeFileAddEvent',
            sid,
            ProjectKeyword,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    // 获取创建收文单表单的默认配置 
    getReceiveDocumentDefault(DocKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Document',
            A: 'GetReceiveDocumentDefault',
            sid,
            DocKeyword,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 处理收文表单
    receiveDocument(docKeyWord, docAttrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Document',
            A: 'ReceiveDocument',
            sid,
            docKeyWord,
            docAttrJson
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 收文流程分发专业获取所在设计阶段的专业列表 
    getProfessionList(WorkFlowKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Document',
            A: 'GetProfessionList',
            sid,
            WorkFlowKeyword,
        })
        return request({
            url: `WebApi/get/?${data}`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 选择收文流程分发专业 
    setReceiveDocProfession(WorkFlowKeyword, professionList) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Document',
            A: 'SetReceiveDocProfession',
            sid,
            WorkFlowKeyword,
            professionList,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },


    // 启动互提资料流程 
    exchangeDocStartWorkFlow(docKeyword, DocList) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.ExchangeDoc',
            A: 'ExchangeDocStartWorkFlow',
            sid,
            docKeyword,
            DocList,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 获取创建内部互提资料表单的默认选项 
    getExchangeDocDefault(ProjectKeyword, ExchangeType) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.ExchangeDoc',
            A: 'GetExchangeDocDefault',
            sid,
            ProjectKeyword,
            ExchangeType,
        })
        return request({
            url: `WebApi/get/?${data}`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    //处理生成提资单，继续提资和提资升版
    createExchangeDoc(ProjectKeyword, ExchangeType, docAttrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.ExchangeDoc',
            A: 'CreateExchangeDoc',
            sid,
            ProjectKeyword,
            ExchangeType,
            docAttrJson
        })
        return request({
            url: `WebApi/post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    },
}