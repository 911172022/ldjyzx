export default {
    namespaced: true,
    state: {
        asideRNotice: true,
        asideRShowNotice: true,
        // 全局方法
        //browserId: 'webPage',
        browserId: 'client',
        // 下载的方法
        downloadMode: true,
        // 是否已经加载ipcRenderer
        loadIpcRenderer: false,
        // 被打开的文件的列表
        openFilesList: []
    },
    mutations: {
        ASIDER_HIDE_CONTROL(state) {
            state.asideRNotice = !state.asideRNotice
        },
        ASIDER_SHOW_CONTROL(state) {
            state.asideRShowNotice = !state.asideRShowNotice
        },
        SET_BROWSER_ID(state, status) {
            state.browserId = status
        },
        SET_DOWNLOAD_MODE(state, status) {
            state.downloadMode = status
        },
        SET_LOAD_IPCRENDERER(state, status) {
            state.loadIpcRenderer= status
        },
        // 增加被打开的文件
        ADD_OPEN_FILE(state, status) {
            state.openFilesList.push(status)
        },
        // 移除被打开的文件
        REMOVE_OPEN_FILE(state, status) {
            for(let i in state.openFilesList) {
                if (state.openFilesList[i].Keyword == status.Keyword) {
                    state.openFilesList.splice(i, 1)
                    return
                }
            }
        }
    },
    actions: {
        setBrowserId({ commit }, payload) {
            commit('SET_BROWSER_ID', payload.browser);
            return Promise.resolve()
        },
        getBrowserId({ state }) {
            console.log(state.browserId)
            return Promise.resolve(state.browserId)
        },
        setDownloadMode({ commit }, payload) {
            commit('SET_DOWNLOAD_MODE', payload.download);
            return Promise.resolve()
        },
        getDownloadMode({ state }) {
            return Promise.resolve(state.downloadMode)
        },
        setLoadIpcRenderer({ commit }, payload) {
            commit('SET_LOAD_IPCRENDERER', payload);
            return Promise.resolve()
        },        
        getLoadIpcRenderer({ state }) {
            return Promise.resolve(state.loadIpcRenderer)
        },        
        // 更改某个文档的文件状态为检出
        setCheckOut({ dispatch }, payload) {
            return dispatch({
                type: 'doc/setCheckOut',
                docKeyword: payload.docKeyword
            }, {
                root: true
            })
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
        setDocStatus({ dispatch }, payload) {
            return dispatch({
                type: 'doc/setDocStatus',
                docKeyword: payload.docKeyword,
                status: payload.status,
                locker: payload.locker
            }, {
                root: true
            })
        },
        /**
         * 增添被打开的文件
         * @param {*} param0 
         * @param {*} payload 
         */
        addOpenFile({ commit, state }, payload) {
            if (state.openFilesList.map(i => i.Keyword).includes(payload.Keyword)) return;
            commit('ADD_OPEN_FILE', payload)
        },
        /**
         * 移除被打开的文件
         * @param {*} param0 
         * @param {*} payload 
         */
        removeOpenFile({ commit }, payload) {
            commit("REMOVE_OPEN_FILE", payload)
        }
    },
    getters: {
        asideRNotice: state => state.asideRNotice,
        asideRShowNotice: state => state.asideRShowNotice,
        downloadMode: state => state.downloadMode,
        browserId: state => state.browserId,
        loadIpcRenderer: state => state.loadIpcRenderer,
        openFilesList: state => state.openFilesList
    }
}
