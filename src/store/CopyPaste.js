import ProjectApi from '../api/services/project'
import { Message } from 'element-ui'

export default {
  namespaced: true,
  state: {
    CopyIds: [],
    isCopy: null,
    messageType: ''
  },
  actions: {
    async projectPaste ({ commit, state }, {ProjectKeyword, status}) {
      if (state.CopyIds.length === 0) return Message({ message: '尚未复制任何目录或文件', type: 'error' })
      let str = ''
      if (status === 'MS_ProjectPaste') str = 'projectPaste'
      else if (status === 'MS_ProjectPasteShortcut') str = 'projectPasteShortcut'
      for (let i in state.CopyIds) await ProjectApi[str](ProjectKeyword, state.CopyIds[i].Keyword, state.isCopy)
      const res = await ProjectApi.saveLastProject(ProjectKeyword)
      if (res.success) {
        if (str === 'projectPasteShortcut') Message({ message: '粘贴快捷成功', type: 'success' })
        else {
          if (state.messageType === 'Copy') Message({ message: '复制成功', type: 'success' })
          else if (state.messageType === 'Move') Message({ message: '剪切成功', type: 'success' })
        }
        commit('project/REFRESH_TREE', true, {root:true})
      }
    }
  },
  mutations: {
    SAVE_COPY (state, {CopyIds, isCopy, messageType}) {
      state.CopyIds = CopyIds
      state.isCopy = isCopy
      state.messageType = messageType
    }
  },
  getters: {}
}
