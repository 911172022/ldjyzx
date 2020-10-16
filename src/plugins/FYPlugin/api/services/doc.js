import request from '@/api/BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
    // 创建发文单
    sendDocument(ProjectKeyWord, docAttrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Document',
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
            C: 'AVEVA.CDMS.FY_Plugins.Document',
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
            C: 'AVEVA.CDMS.FY_Plugins.Document',
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
            C: 'AVEVA.CDMS.FY_Plugins.Document',
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
            C: 'AVEVA.CDMS.FY_Plugins.Document',
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
            C: 'AVEVA.CDMS.FY_Plugins.Document',
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
            C: 'AVEVA.CDMS.FY_Plugins.Document',
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
            C: 'AVEVA.CDMS.FY_Plugins.Document',
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
            C: 'AVEVA.CDMS.FY_Plugins.ExchangeDoc',
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
            C: 'AVEVA.CDMS.FY_Plugins.ExchangeDoc',
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
            C: 'AVEVA.CDMS.FY_Plugins.ExchangeDoc',
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

    // 2020-5-19 创建收文窗口提交
    // 其中attrJson包含有参数：
    // Title  标题
    // Content  内容
    // ReplyDeadline  回复期限
    // SenderList  发文人关键字列表，用","分隔
    NewReceiveDocument(projectKeyword, attrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Document',
            A: 'NewReceiveDocument',
            sid,
            projectKeyword,
            attrJson
        })
        return request({
            url: `WebApi/post?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            // data: data
        })
    },
    // 回复收文文件
    ReplyDocument(docKeyword, attrJson) {
      const sid = store.getters.sid
      const data = Qs.stringify({
          C: 'AVEVA.CDMS.FY_Plugins.Document',
          A: 'ReplyDocument',
          sid,
          docKeyword,
          attrJson
      })
      return request({
          url: `WebApi/post?${data}`,
          method: 'post',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          // data: data
      })
    },
    // 获取文件夹
    // 回复收文文件
    GetWorkflowProject(wfKeyword) {
      const sid = store.getters.sid
      const data = Qs.stringify({
          C: 'AVEVA.CDMS.FY_Plugins.Document',
          A: 'GetWorkflowProject',
          sid,
          wfKeyword
      })
      return request({
          url: `WebApi/post?${data}`,
          method: 'post',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          // data: data
      })
    }

}
