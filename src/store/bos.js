import bosApi from '../api/bos/index.js'
import { bosConfig, MODEL_TYPES } from '../const.js'
import { Message } from 'element-ui'
import docApi from "../api/services/doc.js";



export default {
    namespaced: true,
    state: {
        // 进度条
        progress: 0
    },
    mutations: {
        PROGRESS_UPDATE(state, progress) {
            state.progress = progress
        }
    },
    actions: {
        // 登录bos
        login() {
            bosApi.user.login(bosConfig.name, bosConfig.password, bosConfig.appKey).then(res => {
                if (res.code != 'SUCCESS') {
                    console.log(res)
                    Message.error({
                        message: `登录bos系统失败：${ res.code }`
                    })
                } else {
                    console.log(res)
                    Message.success({
                        message: 'bos系统登录成功',
                    })
                    // 记录 bos access_token
                    localStorage.setItem('bos_access_token', res.data.access_token)
                    localStorage.setItem('bos_expires', res.data.expires)
                    localStorage.setItem('bos_projectKey', res.data.modelDb[0])
                }
            }) 
        },
        // 上传模型
        async uploadModel({ dispatch, commit }, payload) {
            let modelType = payload.modelFile.name.split('.').pop().toLowerCase()
            if (!MODEL_TYPES.includes(modelType)) {
                return Promise.reject(`不支持的文件类型，支持文件类型为${ MODEL_TYPES.join(',') }`)
            }
            const bos_projectKey = localStorage.getItem('bos_projectKey')
            
            let res = await bosApi.model.uploadModel(payload.modleName, 
                payload.modelFile.raw, 
                '', 
                modelType === 'zip' ? 'REVIT' : modelType.toUpperCase(),
                (e) => {
                    commit('PROGRESS_UPDATE', parseInt(e.loaded / e.total * 100))
                })
            if (res.code === 'SUCCESS') {
                console.log(res)
                Message.success({
                    message: '模型上传成功'
                })
                // 解析模型
                let res2 = await bosApi.model.parsesModel(res.data.key)

                if (res2.code === 'SUCCESS') {
                    console.log(res2)
                    dispatch({
                        type: 'afterUploadModel',
                        projectKeyword: payload.projectKeyword,
                        projectCode: payload.modelName,
                        projectKey: bos_projectKey,
                        modelKey: res2.data.modelKey,
                        desc: payload.modelDesc,
                        onSuccess: payload.onSuccess
                    })
                } else {
                    Message.error({
                        message: `解析模型失败：${ res2.message }`
                    })
                    return Promise.reject()
                } 
            } else {
                return Promise.reject()
            }

        }, 
        // 根据fileKey解析模型


        // 上传模型完成，解析完成操作
        afterUploadModel(_, payload) {
            console.log(payload)
            docApi.CreateBosModel(
                payload.projectKeyword,
                payload.projectCode,
                payload.desc,
                payload.projectKey,
                payload.modelKey
            ).then((res) => {
                if (res.success) {
                    Message.success({
                        message: `创建bos模型成功！`
                    })
                    payload.onSuccess()
                } else {
                    Message.error({
                        message: `创建bos模型失败：${ res.msg }`
                    })
                }
            })
        }
    },
    getters: {
        progress: state => state.progress
    }
}