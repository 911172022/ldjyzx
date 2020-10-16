import request from '@/api/BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
    //项目立项
    createRootProject(projectAttrJson) {
        const sid = store.getters.sid
        return request({
            url: `WebApi/Post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: Qs.stringify({
                C: 'AVEVA.CDMS.FY_Plugins.CreateProject',
                A: 'CreateRootProject',
                sid,
                projectAttrJson,
            }),
        })
    },
    //创建项目时，获取表单默认值，填充到combo 
    getCreateRootProjectDefault() {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.CreateProject',
            A: 'GetCreateRootProjectDefault',
            sid,
        })
        return request({
            url: `WebApi/get/?${data}`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    //获取二级项目类型 
    getProjectTypeII(projectType) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.CreateProject',
            A: 'CreateRootProject',
            sid,
            projectType
        })
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    //设置项目文秘和进度工程师 
    setDirector(projectType, checkerList, auditorList) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.CreateProject',
            A: 'SetDirector',
            sid,
            projectType,
            checkerList,
            auditorList
        })
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 设置项目设总
    setProjectOwner(projectType, userList) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.CreateProject',
            A: 'SetProjectOwner',
            sid,
            projectType,
            userList
        })
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    startNewWorkFlow(DocList, WfKeyword, userlist) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.WebApi.WorkFlowController',
            A: 'StartNewWorkFlow',
            sid,
            DocList,
            WfKeyword,
            userlist,
        })
        return request({
            url: `WebApi/Post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    }
}
