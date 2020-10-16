import request from '@/api/BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
    // 设置成品会签专业
    setProdectSignProfession(DocKeyword, Receiver) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Prodect',
            A: 'SetProdectSignProfession',
            sid,
            DocKeyword,
            Receiver
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 获取“成品校审会签专业”表单默认参数 
    getProductSignDefault(DocKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Prodect',
            A: 'GetProductSignDefault',
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
    // 创建成品目录 
    createProdect(ProjectKeyword, projectAttrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.Prodect',
            A: 'CreateProdect',
            sid,
            ProjectKeyword,
            projectAttrJson: JSON.stringify(projectAttrJson)
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