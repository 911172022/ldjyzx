import request from '@/api/BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
    //新建厂家资料目录时，获取默认值 
    getEditCompanyDefault(ProjectKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Company',
            A: 'GetEditCompanyDefault',
            sid,
            ProjectKeyword
        })
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 修改厂家资料目录 
    editCompany(ProjectKeyword, projectAttrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Company',
            A: 'EditCompany',
            sid,
            ProjectKeyword,
            projectAttrJson,
        })
        return request({
            url: `WebApi/Post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    },
}
