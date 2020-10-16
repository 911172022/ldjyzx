import request from '@/api/BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
    // 获取专业列表 
    getProfessionList() {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Profession',
            A: 'GetProfessionList',
            sid,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 设置项目的相关专业 
    setProfession(prjoectKeyword, designPhase, professionList, startAtWfBtn) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Profession',
            A: 'SetProfession',
            sid,
            prjoectKeyword,
            designPhase,
            professionList,
            startAtWfBtn
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
    // 获取项目某个阶段已创建的专业，以及项目阶段(选取项目根目录时触发) 
    getDesignPhaseProfession(ProjectKeyword, DesignPhaseCode) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Profession',
            A: 'GetDesignPhaseProfession',
            sid,
            ProjectKeyword,
            DesignPhaseCode
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 根据ProjectKeyword获取已创建的专业，以及项目阶段(选取项目阶段目录时触发) 
    getCreatedProfession(ProjectKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Profession',
            A: 'GetCreatedProfession',
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
}