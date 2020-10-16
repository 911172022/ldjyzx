export default {
    namespaced: true,
    state: {
        downloadTasks: []
    },
    mutations: {
        UPDATE_DOWNLOAD_TASKS(state, status) {
            for(let i in state.downloadTasks) {
                if (status.docKeyword === state.downloadTasks[i].docKeyword) {
                    // 更新进度
                    // 有时候传过来的progress是null
                    state.downloadTasks[i].progress = status.progress || 0
                    if (status.status) {
                        state.downloadTasks[i].status = status.status
                    }
                    state.downloadTasks[i].downloadedSize = status.downloadedSize
                    state.downloadTasks[i].size = status.size
                    return
                }
            }
            state.downloadTasks.unshift(status)
        },
        
    },
    actions: {
        // // 获取下载任务
        // getDownloadTasks({state}, payload) {

        // },
    },
    getters: {
        downloadTasks: state => state.downloadTasks
    }
}