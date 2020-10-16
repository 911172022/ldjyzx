import UserApi from '../api/services/workflow'
import { FormatFileSize } from '@/util/FormatFileSize'

export default {
  namespaced: true,
  state: {
    WorkflowType: '',
    data: [],
    pagination: {
      total: 0,
      pageSize: 0
    },
    opinionData: [],
    Keyword: '', // 文档KeyWord
    ProcessAttributesList: [],
    ProcessAttributes: {},
    ProcessStatus: [],
    ProcessHistory: [],


    WorkflowKeyword: '',
    ProcessBtns: [],
    ProcessRightBtns: [],
    bAuditDropdown: false,
    OptionalAudits: [],
    IsFinish: '',


    // 刷新触发器
    refreshTrigger: false,
  },
  actions: {
    getWorkFlowPlaceList ({ commit }, { WorkflowType, page, limit = 50 }) {
      commit('WTYPE', WorkflowType)
      UserApi.getWorkFlowPlaceList(WorkflowType, page, limit).then(res => {
        commit('GET_WORKFLOWPLACE_LIST', res.data)
        const total = res.total
        commit('GET_WORKFLOWPLACE_TOTAL', { total, limit })
      })
    },
    // 获取消息信息
    getWorkFlow ({ commit }, Keyword) {
      commit('WFLOW', Keyword)
      UserApi.getWorkFlow(Keyword).then(res => {
        if (res.success) {
          commit('GET_WORK_FLOW', res.data)
          UserApi.getWorkFlowPagesData(Keyword).then(res => {
            commit('GET_WORKFLOW_PAGESDATA', res.data)
          })
        }
      })
    },
    addWorkUser ({ dispatch, state }, { ObjectKeyword, WorkStateKeyword, UserList }) {
      UserApi.addWorkUser(ObjectKeyword, WorkStateKeyword, UserList).then(() => {
        dispatch('getWorkFlow', state.Keyword)
      })
    },
    // 获取所选对象可用的流程列表
    getObjectsDefWorkFlowList({ commit }, Keyword) {
      UserApi.getObjectsDefWorkFlowList(Keyword).then(res => {
        commit('GET_OBJECTS_DEFWORKFLOW_LIST', res.data)
      })
    },
    // 开始新流程
    startNewWorkFlow({ commit }, DocList, WfKeyword, userlist) {
      UserApi.startNewWorkFlow(DocList, WfKeyword, userlist).then(res => {
        commit('START_NEW_WORKFLOW', res.data)
      })
    },
    // 开始新流程
    gotoNextWfState({ commit }, WfKeyword, BrachKeyword, userlista) {
      UserApi.gotoNextWfState(WfKeyword, BrachKeyword, userlista).then(res => {
        commit('GOTO_NEXT_WF_STATE', res.data)
      })
    },
    //添加流程意见
    addWorkflowAudit({ commit }, Keyword, ProcAudit) {
      UserApi.addWorkflowAudit(Keyword, ProcAudit).then(res => {
        commit('ADD_WORKFLOW_AUDIT', res.data)
      })

    },
    //编辑流程意见
    modiWorkflowAudit({ commit }, WorkStateKeyword,CheckerKeyword,CheckDate,ProcAudit,DeProcAudit) {
      UserApi.modiWorkflowAudit(WorkStateKeyword,CheckerKeyword,CheckDate,ProcAudit,DeProcAudit).then(res => {
        commit('MODI_WORKFLOW_AUDIT', res.data)
      })

    },
    //删除流程
    deleteWorkFlow({ commit }, Keyword) {
      UserApi.deleteWorkFlow(Keyword).then(res => {
        commit('DELETE_WORKFLOW', res.data)
      })

    },
    //撤回流程
    revokeWorkFlow({ commit }, Keyword) {
      UserApi.revokeWorkFlow(Keyword).then(res => {
        commit('REVOKE_WORKFLOW', res.data)
      })

    },
    //撤销提交
    rebackWorkFlow({ commit }, Keyword) {
      UserApi.rebackWorkFlow(Keyword).then(res => {
        commit('REBACK_WORKFLOW', res.data)
      })

    }
  },
  mutations: {
    // 每次切换模块时应重置流程（因为组件重用，切换模块时会保留下上一个模块查询的流程的信息）
    CLEAR_WORKFLOW(state) {
      state.WorkflowType = ''
      state.data = []
      state.pagination = {
        total: 0,
        pageSize: 0
      }
      state.opinionData = []
      state.Keyword = ''
      state.ProcessAttributesList = []
      state.ProcessAttributes = {}
      state.ProcessStatus = []
      state.ProcessHistory = []
      state.WorkflowKeyword = ''
      state.ProcessBtns = []
      state.ProcessRightBtns = []
      state.bAuditDropdown = false
      state.OptionalAudits = []
      state.IsFinish = ''
    },
    WTYPE (state, status) {
      state.WorkflowType = status
    },
    WFLOW (state, status) {
      state.Keyword = status
    },
    GET_WORKFLOWPLACE_LIST (state, status) {
      state.data = status
    },
    GET_WORKFLOWPLACE_TOTAL (state, { total, limit }) {
      state.pagination.total = total
      state.pagination.pageSize = limit
    },
    GET_WORK_FLOW(state, status) {
      state.opinionData = []
      state.IsFinish = ''
      state.ProcessBtns = []
      state.ProcessRightBtns = []
      state.OptionalAudits = []
      state.bAuditDropdown = false
      status.forEach(item => {
        if (item.UserName) {

          //添加已通过的流程状态及通过人员
          if (item.FinishUser) {
            let fdItem = {};

            fdItem.AuditContent = item.WorkState + " " + item.FinishBrach + " \r\n" + item.FinishUser + " " + item.FinishDate;
            state.opinionData.push(fdItem)


          }

          if ((item.ProcAudit) && item.ProcAudit != "") {

            item.AuditContent = "";

            let itemData = item;
            let AuditContent = "";

            if (itemData.ProcAudit != "" && itemData.ProcAudit != undefined) {
              AuditContent = AuditContent + itemData.WorkState + " " + itemData.UserName + " 意见：" + "\r\n";
              AuditContent = AuditContent + itemData.ProcAudit + "\r\n";

              if (itemData.DeProcAudit != "" && itemData.DeProcAudit != undefined) {
                AuditContent = AuditContent + "修改意见：" + "\r\n";
                AuditContent = AuditContent + itemData.DeProcAudit + "\r\n";
              }

              AuditContent = AuditContent + itemData.ProcTime;//+ "\r\n";

            }

            item.AuditContent = AuditContent
            state.opinionData.push(item)
          }
        }
        if (item.WfKeyword) {
          state.WorkflowKeyword = item.WfKeyword
        }
        // 添加按鈕
        if (item.BtnType) {
          // T 開, F 關
          if (item.Enabled == "F") {
            item.Disabled = true
          } else {
            item.Disabled = false
          }
          if (item.BtnType == 'btn') {
            // 退回修改、提交批准
            state.ProcessBtns.push(item);
          } else if (item.BtnType == 'reback') {
            // 删除、撤回
            state.ProcessRightBtns.push(item)
          }
          else if (item.BtnType == 'addAduit') {
            // 无意见;建议修改;退回修改
            state.bAuditDropdown = true
            //从item.Desc获取可选的校审意见
            if (item.Desc) {
              let oAuditArr = item.Desc.split(';')
              oAuditArr.forEach(oaItem => {
                state.OptionalAudits.push({ 'text': oaItem })
              })
            }
          }
        }
        // 完成
        if (item.isFinish) {
          state.IsFinish = item.isFinish
        }
      })
    },
    GET_WORKFLOW_PAGESDATA (state, status) {
      state.ProcessAttributesList = []
      state.ProcessAttributes = {}
      state.ProcessStatus = []
      state.ProcessHistory = []
      status.forEach(item => {
        if (item.code) {
          item.formatSize = FormatFileSize(item.o_size)
          state.ProcessAttributesList.push(item)
        }
        if (item.desc === 'DefWorkFlowCode') {
          state.ProcessAttributes.DefWorkFlowCode = item.WorkState
        } else if (item.desc === 'DefWorkFlowDesc') {
          state.ProcessAttributes.DefWorkFlowDesc = item.WorkState
        }
        if (item.PageId === "2") {
          state.ProcessStatus.push(item)
        }
        if (item.PageId === "3") {
          state.ProcessHistory.push(item)
        }
      })
    },
    GET_OBJECTS_DEFWORKFLOW_LIST(state, status) {
      state.ObjectDefWfList = status
    },
    START_NEW_WORKFLOW(state, status) {
      state.StartNewWorkflowResult = status
    },
    GOTO_NEXT_WF_STATE(state, status) {
      state.GotoNextWfStateResult = status
    },
    ADD_WORKFLOW_AUDIT(state, status) {
      state.AddWorkflowAuditResult = status
    },
    MODI_WORKFLOW_AUDIT(state, status) {
      state.ModiWorkflowAuditResult = status
    },
    DELETE_WORKFLOW(state, status) {
      state.DeleteWorkflowResult = status
    },
    REVOKE_WORKFLOW(state, status) {
      state.RevokeWorkflowResult = status
    },
    REBACK_WORKFLOW(state, status) {
      state.RebackWorkflowResult = status
    },
    // 去触发流程工作台里的刷新
    REFRESH_TRIGGER(state, status) {
      state.refreshTrigger = status
    }
  },
  getters: {
    workflowList: state => state.data,
    pagination: state => state.pagination,
    WorkflowType: state => state.WorkflowType,
    opinionData: state => state.opinionData,
    Keyword: state => state.Keyword,
    ProcessAttributes: state => state.ProcessAttributes,
    ProcessStatus: state => state.ProcessStatus,
    ProcessHistory: state => state.ProcessHistory,
    ProcessAttributesList: state => state.ProcessAttributesList,

    WorkflowKeyword: state => state.WorkflowKeyword,
    ObjectDefWfList: state => state.ObjectDefWfList,
    StartNewWorkflowResult: state => state.StartNewWorkflowResult,
    GotoNextWfStateResult: state => state.GotoNextWfStateResult,
    AddWorkflowAuditResult: state => state.AddWorkflowAuditResult,
    ModiWorkflowAuditResult: state => state.ModiWorkflowAuditResult,
    //getWorkFlow相关的返回
    IsFinish: state => state.IsFinish,
    ProcessBtns: state => state.ProcessBtns,
    ProcessRightBtns: state => state.ProcessRightBtns,
    bAuditDropdown: state => state.bAuditDropdown,
    OptionalAudits: state => state.OptionalAudits,
    DeleteWorkflowResult: state => state.DeleteWorkflowResult,
    RevokeWorkflowResult: state => state.RevokeWorkflowResult,
    RebackWorkflowResult: state => state.RebackWorkflowResult,
    // 刷新触发器
    refreshTrigger: state => state.refreshTrigger
  }
}
