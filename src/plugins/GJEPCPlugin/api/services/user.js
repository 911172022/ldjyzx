import request from '@/api/BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
    // 设置项目文秘和进度工程师 
    setDirector(prjoectKeyword, checkerList, auditorList) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.EnterPoint',
            A: 'SetDirector',
            sid,
            prjoectKeyword,
            checkerList: JSON.stringify(checkerList),
            auditorList: JSON.stringify(auditorList)
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 设置项目设总
    setProjectOwner(prjoectKeyword, userlist) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.EnterPoint',
            A: 'SetProjectOwner',
            sid,
            prjoectKeyword,
            userlist,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 响应主设人选择校审核人员表单的确定按钮 
    selectUserEx(workflowAttrJson) {
        const sid = store.getters.sid
        return request({
            url: `WebApi/post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: Qs.stringify({
                C: 'AVEVA.CDMS.HXPC_Plugins.SelectUser',
                A: 'SelectUserEx',
                sid,
                workflowAttrJson: JSON.stringify(workflowAttrJson),
            })
        })
    },
    // 响应主设人选择校核审核批准人员表单的确定按钮 
    selectUserApprov(workflowAttrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.SelectUser',
            A: 'SelectUserApprov',
            sid,
            workflowAttrJson: JSON.stringify(workflowAttrJson),
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
    // 主设人选择校审核人员时，获取默认值 
    getSelectUserExDefault(WorkFlowKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.SelectUser',
            A: 'GetSelectUserExDefault',
            sid,
            WorkFlowKeyword,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 主设人选择校审核人员时，获取默认值 
    getSelectUserApprovDefault(WorkFlowKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.SelectUser',
            A: 'GetSelectUserApprovDefault',
            sid,
            WorkFlowKeyword,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
}