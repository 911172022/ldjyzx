/*
 * @Author: CiFong
 * @Date: 2020-04-03 13:51:19
 * @LastEditors: CiFong
 * @LastEditTime: 2020-04-07 09:36:52
 * @Description: 请输入
 */
export default {
    namespaced: true,
    state: {
        tableHeight: 0,
        isPreview: null,
        isTable: true,
        PreviewImgURL: "",
        PreviewDocURL: "",
        PreviewVideoURL: '',
        navUrl: "",
        changeClientWidth: 0,
        Type: ""
    },
    actions: {},
    mutations: {
        GET_MENU_TYPE(state, status) {
            state.Type = status
        },
        CHANGE_TABLE_HEIGHT(state, status) {
            state.tableHeight = status
        },
        ISPREVIEW(state, status) {
            state.isPreview = status
        },
        ISTABLE(state, status) {
            state.isTable = status
        },
        GET_PREVIEWIMG_URL(state, status) {
            console.log(status)
            state.PreviewImgURL = status
        },
        GET_PREVIEWDOC_URL(state, status) {
            console.log(status)
            state.PreviewDocURL = status
        },
        GET_PREVIEWVIDEO_URL(state, status) {
            console.log(status)

            state.PreviewVideoURL = status
        },
        GET_NAVURL(state, status) {
            state.navUrl = status
        },
        CHANGE_CLIENT_WIDTH(state, status) {
            state.changeClientWidth = status
        },
    },
    getters: {
        tableHeight: state => state.tableHeight,
        isPreview: state => state.isPreview,
        isTable: state => state.isTable,
        PreviewImgURL: state => state.PreviewImgURL,
        PreviewDocURL: state => state.PreviewDocURL,
        PreviewVideoURL: state => state.PreviewVideoURL,
        navUrl: state => state.navUrl,
        changeClientWidth: state => state.changeClientWidth,
        Type: state => state.Type
    }
}
