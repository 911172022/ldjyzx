import UserApi from '../api/services/doc'
import UserApi2 from '../api/services/project'
import bosApi from '../api/bos/index'
import { AddTypeIcon } from '../util/AddTypeIcon'
import { Message } from 'element-ui'

export default {
    namespaced: true,
    state: {
        ProjectKeyWord: '',
        DocList: [],
        pagination: {
            total: 0,
            pageSize: 0
        },
        ProjectShowPath: '',
        ProjectBaseAttr: [],
        ProjectAttrData: [],
        RightList: [],
        DocKeyword: '',
        DocBaseAttr: [],
        DocAttrData: [],
        tabsName: {
            DirectoryName: true
        },
        activeName: 'a',
        Keyword: '',
        List: [],
        GoToPreview: true,
        // 模型预览
        modelKey: null,
        projectKey: null,
        bos3dModelShow: false,
        projectModel: null,
        // 用户刷新列表
        refreshList: true,
    },
    actions: {
        getDocList({ commit }, { ProjectKeyWord, filterJson, page, limit }) {
            commit('PTYPE', ProjectKeyWord)
            commit('KTYPE', ProjectKeyWord)
            UserApi.getDocList(ProjectKeyWord, filterJson, page, limit).then(res => {
                if (filterJson !== '' && res.msg !== '') {
                    Message({ message: res.msg, type: 'error' })
                }
                commit('GET_DOC_LIST', res.data)
                const total = res.total
                commit('GET_DOC_TOTAL', { total, limit })

            })
        },
        getDocBaseAttr({ commit }, DocKeyword) {
            commit('DTYPE', DocKeyword)
            commit('KTYPE', DocKeyword)
            UserApi.getDocBaseAttr(DocKeyword).then(res => {
                commit('GET_DOC_BASEATTR', res.data)
                commit('AdjustMenuWidth/AM_WIDTH', '', { root: true })
            })
        },
        getDocAttrData({ commit }, DocKeyword) {
            UserApi.getDocAttrData(DocKeyword).then(res => {
                commit('GET_DOC_ATTRDATA', res.data)
            })
        },
        getDocRightList({ commit }, DocKeyword) {
            UserApi.getDocRightList(DocKeyword).then(res => {
                commit('GET_RIGHTLIST', res.data)
            })
        },
        getProjectShowPath({ commit }, ProjectKeyword) {
            UserApi2.getProjectShowPath(ProjectKeyword).then(res => {
                commit('GET_PROJECT_SHOWPATH', res.data[0].path)
            }).catch(err => {
                // 2020.4.16 不知道什么bug
                console.log(err)
            })
        },
        getProjectBaseAttr({ commit }, ProjectKeyword) {
            UserApi2.getProjectBaseAttr(ProjectKeyword).then(res => {
                commit('GET_PROJECT_BASEATTR', res.data)
                commit('AdjustMenuWidth/AM_WIDTH', '', { root: true })
            })
        },
        getProjectAttrData({ commit }, ProjectKeyword) {
            UserApi2.getProjectAttrData(ProjectKeyword).then(res => {
                commit('GET_PROJECT_ATTRDATA', res.data)
            })
        },
        getProjectRightList({ commit }, ProjectKeyword) {
            UserApi2.getProjectRightList(ProjectKeyword).then(res => {
                commit('GET_RIGHTLIST', res.data)
            })
        },
        // 2020.4.20-1
        getProjectBos3dData({ commit }, ProjectKeyWord) {
            return new Promise((resolve, reject) => {
                UserApi.getDocBosModel(ProjectKeyWord).then(async res => {
                    if (res.success) {
                        if (res.data.length === 0) return;
                        // 先访问模型文件解析成功没有
                        let res2 = await bosApi.model.parsesStatus(res.data[0].bosModelKey, res.data[0].bosProjectKey)
                        console.log(res2)
                        if (res2.code === 'SUCCESS') {
                            if (res2.data.status === '3') {
                                res.data[0].control = true
                                commit("SET_MODEL_PREVIEW", res.data[0])
                                // // 直接跳转到模型预览项
                                commit('menu/ISPREVIEW', 'MODEL', { root: true })
                                commit("menu/ISTABLE", false, { root: true })
                                // 右边那里要转向模型预览的tab
                                commit("CHANGE_ACTIVENAME", 'h');
                                resolve()
                            } else if (res2.data.status === '-1' || res2.data.status === '-2') {
                                Message.error({
                                    message: `模型解析错误：${res2.data.remark}，请重新上传模型。`
                                })
                            } else {
                                Message.warning({
                                    message: `模型解析未完成：${res2.data.remark}，解析进度：${res2.data.percentage}`
                                })
                                commit("SET_MODEL_PREVIEW", { control: false })
                            }
                        } else {
                            Message.error({
                                message: `获取模型解析状态失败：${res2.message}`
                            })
                            commit("SET_MODEL_PREVIEW", { control: false })
                        }
                    } else {
                        commit("SET_MODEL_PREVIEW", { control: false })
                    }
                }).catch(err => {
                    reject(err)
                })
            })

        },
        // 设置检出状态
        setCheckOut({ commit }, payload) {
            commit('SET_CHECKOUT', payload.docKeyword);
            return Promise.resolve()
        },

        /**
         * 设置文档的状态
         * @param {*} param0 
         * @param {Object} payload
         * {
         *  docKeyword: 接受以,分割的文档关键字
         *  status: 要改成的状态，直接状态的中文
         *          -   检入
         *          -   检出
         *          -   已打开
         *          -   只读
         *          -   输出
         *          -   最终状态
         *          -   锁定
         * } 
         */
        async setDocStatus({ commit, dispatch }, payload) {
            commit("SET_DOC_STATUS", payload)

            if (payload.status === '检出' || payload.status === '只读') {
                // 增添到打开的文件那里
                let res = await UserApi.getDocBaseAttr(payload.docKeyword)
                let file = {}
                for (let j in res.data) {
                    file[res.data[j].AttrCode] = res.data[j].AttrValue
                }
                file.Keyword = payload.docKeyword
                dispatch({
                    type: 'home/addOpenFile',
                    ...file
                }, {
                    root: true
                })
            } else {
                // 移除已打开文件 openFileLists
                dispatch({
                    type: 'home/removeOpenFile',
                    Keyword: payload.docKeyword
                }, {
                    root: true
                })
            }


        }
    },
    mutations: {
        // 设置检出状态
        SET_CHECKOUT(state, status) {
            let docKeyword = status.split(',')
            state.DocList.forEach(i => {
                if (docKeyword.includes(i.Keyword)) {
                    i.O_dmsstatus_DESC = '检出'
                }
            })
        },
        /**
         * 设置文档的状态
         * @param {*} state
         * @param {Object} status
         * {
         *  docKeyword: 接受以,分割的文档关键字
         *  status: 要改成的状态，直接状态的中文
         *          -   检入
         *          -   检出
         *          -   已打开
         *          -   只读
         *          -   输出
         *          -   最终状态
         *          -   锁定
         * } 
         */
        SET_DOC_STATUS(state, status) {
            let docKeyword = status.docKeyword.split(',')
            state.DocList.forEach(i => {
                if (docKeyword.includes(i.Keyword)) {
                    i.O_dmsstatus_DESC = status.status
                    if (status.locker) {
                        i.FLocker = status.locker
                    }
                }
            })
        },

        GO_TO_PREVIEW(state) {
            state.GoToPreview = !state.GoToPreview;
        },
        PTYPE(state, status) {
            state.ProjectKeyWord = status
        },
        DTYPE(state, status) {
            state.DocKeyword = status
        },
        KTYPE(state, status) {
            state.Keyword = status
        },
        LIST(state, status) {
            let arr = []
            status.forEach(item => {
                let imgUrl = AddTypeIcon(item.name)
                arr.push({
                    name: item.name,
                    src: imgUrl
                })
            })
            state.List = arr
        },
        GET_DOC_LIST(state, status) {
            let arr = []
            status.forEach(item => {
                let imgUrl = AddTypeIcon(item.O_filename)
                arr.push({
                    ...item,
                    src: imgUrl
                })
            })
            state.refreshList = false
            state.DocList = arr
        },
        SET_REFRESH_LIST(state) {
            state.refreshList = true
        },
        GET_DOC_TOTAL(state, { total, limit }) {
            state.pagination.total = total
            state.pagination.pageSize = limit
        },
        GET_PROJECT_SHOWPATH(state, status) {
            state.ProjectShowPath = status
        },
        // 点击目录请求
        GET_PROJECT_BASEATTR(state, status) {
            // 目录属性
            let arr = status.filter((item) => item.Visible === 'True')
            state.ProjectBaseAttr = arr
            // Tabs 标签页
            state.tabsName = {}
            state.tabsName.O_WorkFlowno = false
            status.forEach((item) => {
                // 判断是否有目录属性
                if (item.AttrName === '目录名') {
                    state.tabsName.DirectoryName = true
                    state.activeName = 'a'
                    // 判断是否有目录附加属性
                } else if (item.AttrCode === 'AttrDataCount') {
                    const num = Number(item.AttrValue)
                    if (num > 1) {
                        state.tabsName.AttrDataCount = true
                    }
                    // 判断是否有流程
                } else if (item.AttrCode === 'O_WorkFlowno') {
                    if (item.AttrValue) {
                        state.tabsName.O_WorkFlowno = true
                    }
                    // 判断是否有权限列表
                } else if (item.AttrCode === 'isAdmin') {
                    if (item.AttrValue === 'True') {
                        state.tabsName.isAdmin = true
                    }
                }
            })
        },
        // 2020.4.20-1
        // 判断是否需要模型预览
        SET_MODEL_PREVIEW(state, status) {
            state.bos3dModelShow = status.control
            if (status.control) {
                state.modelKey = status.bosModelKey
                state.projectKey = status.bosProjectKey
                state.projectModel = status.projectModel
            } else {
                state.modelKey = null
                state.projectKey = null
                state.projectModel = null
            }
        },
        GET_PROJECT_ATTRDATA(state, status) {
            state.ProjectAttrData = []
            let arr = status.filter(item => item.TempAttrType === 3 || item.TempAttrType === 4)
            state.ProjectAttrData = arr
        },
        GET_RIGHTLIST(state, status) {
            status.pop()
            state.RightList = status
        },
        // 增加权限列表用户时回调
        ADD_PERMISSION_USER(state, status) {
            state.RightList = status
        },
        // 点击文件请求
        GET_DOC_BASEATTR(state, status) {
            // 文档属性
            let arr = status.filter(item => item.Visible === 'True')
            state.DocBaseAttr = arr
            // Tabs 标签页
            state.tabsName = {}
            state.tabsName.O_WorkFlowno2 = false
            status.forEach((item) => {
                if (item.AttrCode === 'O_filename') {
                    // 判断是否有是文件属性
                    if (item.AttrName === '文件名') {
                        state.tabsName.fileName = true
                        state.activeName = 'c'
                    }
                    // 判断是否有文档浏览
                    if (item.AttrValue) {
                        state.tabsName.O_filename = true
                    }
                    // 判断是否有文档附加属性
                } else if (item.AttrCode === 'AttrDataCount') {
                    const num = Number(item.AttrValue)
                    if (num > 1) {
                        state.tabsName.AttrDataCount2 = true
                    }
                    // 判断是否有流程
                } else if (item.AttrCode === 'O_WorkFlowno') {
                    if (item.AttrValue !== '') {
                        state.tabsName.O_WorkFlowno2 = true
                    }
                    // 判断是否有权限列表
                } else if (item.AttrCode === 'isAdmin') {
                    if (item.AttrValue === 'True') {
                        state.tabsName.isAdmin = true
                    }
                }
            })
        },
        GET_DOC_ATTRDATA(state, status) {
            state.DocAttrData = []
            let arr = status.filter(item => item.TempAttrType === 3 || item.TempAttrType === 4)
            state.DocAttrData = arr
        },
        CHANGE_ACTIVENAME(state, status) {
            state.activeName = status
        },
    },
    getters: {
        List: state => state.List,
        DocList: state => state.DocList,
        pagination: state => state.pagination,
        ProjectKeyWord: state => state.ProjectKeyWord,
        DocKeyword: state => state.DocKeyword,
        ProjectShowPath: state => state.ProjectShowPath,
        ProjectBaseAttr: state => state.ProjectBaseAttr,
        ProjectAttrData: state => state.ProjectAttrData,
        RightList: state => state.RightList,
        DocBaseAttr: state => state.DocBaseAttr,
        DocAttrData: state => state.DocAttrData,
        tabsName: state => state.tabsName,
        activeName: state => state.activeName,
        Keyword: state => state.Keyword,
        // 2020.4.20-1
        modelKey: state => state.modelKey,
        projectKey: state => state.projectKey,
        bos3dModelShow: state => state.bos3dModelShow,
        projectModel: state => state.projectModel,
        // 用于刷新列表
        refreshList: state => state.refreshList
    }
}
