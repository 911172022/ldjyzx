import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
    // 获取流程模板
    getCDefWorkFlow(defWorkFlowKeyWord) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.WebApi.CDefWorkFlowController',
            A: 'GetCDefWorkFlow',
            sid,
            defWorkFlowKeyWord
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
    // 保存流程状态模板的位置
    saveCDefWFStatePosition(defWorkFlowKeyWord, wsPositionJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.WebApi.CDefWorkFlowController',
            A: 'SaveCDefWFStatePosition',
            sid,
            defWorkFlowKeyWord,
            wfStatePositionJson:JSON.stringify(wsPositionJson)
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
    //新建流程状态模板
    newCDefWfState(defWorkFlowKeyWord, locationX, locationY)  {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.WebApi.CDefWorkFlowController',
            A: 'NewCDefWfState',
            sid,
            defWorkFlowKeyWord,
            locationX,
            locationY
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
    //新建流程状态模板
    newCDefWfBranch(defWorkFlowKeyWord,preWorkStateKeyword,nextWorkStateKeyword,startPtX,startPtY,endPtX,endPtY)  {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.WebApi.CDefWorkFlowController',
            A: 'NewCDefWfBranch',
            sid,
            defWorkFlowKeyWord,
            preWorkStateKeyword, 
            nextWorkStateKeyword,
            startPtX, 
            startPtY, 
            endPtX, 
            endPtY
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