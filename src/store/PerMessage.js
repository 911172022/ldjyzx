import UserApi from '../api/services/message'

export default {
  namespaced: true,
  state: {
    MessageType: '',
    messageList: [],
    pagination: {
      total: 0,
      pageSize: 0
    },
    Message: {},
    MessageKeyword: '',
    Attachment: [],
    Process: '',
    activeName: null,
    WorkFlowKeyword: '',
    AttachmentDocData: {},
    messageListId: '',
    // 控制个人工作台的预览
    isTable: true
  },
  actions: {
    getMessageList ({ commit }, { MessageType, page, limit = 50 }) {
      commit('MTYPE', MessageType)
      UserApi.getMessageList(MessageType, page, limit).then(res => {
        commit('GET_MESSAGE_LIST', res.data)
        const total = res.total
        commit('GET_MESSAGE_TOTAL', { total, limit })
      })
    },
    getMessage ({ commit }, MessageKeyword) {
      commit('DTYPE', MessageKeyword)
      UserApi.getMessage(MessageKeyword).then(res => {
        commit('GET_MESSAGE', res.data[0])
        commit('GET_MESSAGE_ATTACHMENT', res.data)
      })
    },
  },
  mutations: {
    SET_IS_TABLE(state, status) {
      state.isTable = status
    },
    // 用户进入个人消息页时清空之前的数据
    CLEAR_MESSAGE(state) {
      state.MessageType = ''
      state.messageList = []
      state.pagination = {
        total: 0,
        pageSize: 0
      }
      state.Message = {}
      state.MessageKeyword = ''
      state.messageListId = ''
    },
    MTYPE (state, status) {
      state.MessageType = status
    },
    DTYPE (state, status) {
      state.MessageKeyword = status
    },
    GET_MESSAGE_LIST (state, status) {
      state.messageList = status
    },
    GET_MESSAGE_TOTAL (state, { total, limit }) {
      state.pagination.total = total
      state.pagination.pageSize = limit
    },
    // 判断按钮是否禁用
    GET_MESSAGE_ID (state, status) {
      state.messageListId = status
    },
    // 点击文件请求
    GET_MESSAGE (state, status) {
      state.Message = status
      state.Process = status.HasWorkFlow
      state.WorkFlowKeyword = status.WorkFlowKeyword
      state.activeName = 'a'
    },
    GET_MESSAGE_ATTACHMENT (state, status) {
      let arr = status.filter(item => item.Attachment)
      state.Attachment = arr
    },
    CHANGE_ACTIVENAME (state, status) {
      state.activeName = status
    },
    ATTACHMENT_MOVE_DOC (state, status) {
      state.AttachmentDocData = status
    }
  },
  getters: {
    messageList: state => state.messageList,
    pagination: state => state.pagination,
    MessageType: state => state.MessageType,
    Message: state => state.Message,
    MessageKeyword: state => state.MessageKeyword,
    Attachment: state => state.Attachment,
    Process: state => state.Process,
    activeName: state => state.activeName,
    WorkFlowKeyword: state => state.WorkFlowKeyword,
    AttachmentDocData: state => state.AttachmentDocData,
    messageListId: state => state.messageListId,
    isTable: state => state.isTable
  }
}
