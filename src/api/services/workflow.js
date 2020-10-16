import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
  //获取WorkflowPlace流程类别对象下子WorkflowPlace树节点列表
  getWorkFlowPlaceTree(node) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'GetWorkFlowPlaceTree',
      sid,
      node
    })
    return request({
      url: `WebApi/get/?${data}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取当前用户流程列表
  getWorkFlowPlaceList(WorkflowType, page, limit) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'GetWorkFlowPlaceList',
      sid,
      WorkflowType,
      page,
      limit
    })
    return request({
      url: `WebApi/get/?${data}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //根据DOC或者Project或者WorkFlow的Keyword，返回一个对象的工作流各个状态的意见的JSON对象
  // DOC，Project，WorkFlow的Keyword里面只选一个来处理
  getWorkFlow(Keyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'GetWorkFlow',
      sid,
      Keyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //返回流程页信息
  getWorkFlowPagesData(Keyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'GetWorkFlowPagesData',
      sid,
      Keyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //删除流程状态人员
  deleteWorkUser(ObjectKeyword, WorkStateKeyword, UserKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'DeleteWorkUser',
      sid,
      ObjectKeyword,
      WorkStateKeyword,
      UserKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //添加流程状态人员
  addWorkUser(ObjectKeyword, WorkStateKeyword, UserList) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'AddWorkUser',
      sid,
      ObjectKeyword,
      WorkStateKeyword,
      UserList
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //启动新流程
  startNewWorkFlow(DocList, WfKeyword, userlist) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'StartNewWorkFlow',
      sid,
      DocList,
      WfKeyword,
      userlist
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取可用流程模板列表
  getObjectsDefWorkFlowList(DocList) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'GetDefWorkFlowList',
      sid,
      DocList
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //跳转到下一流程状态
  gotoNextWfState(WfKeyword, BrachKeyword, userlist) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'GotoNextWfState',
      sid,
      WfKeyword,
      BrachKeyword,
      userlist
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //添加流程意见
  // 参数ProcAudit:流程意见
  addWorkflowAudit(Keyword, ProcAudit) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'AddWorkflowAudit',
      sid,
      Keyword,
      ProcAudit
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //编辑流程意见
  // 参数ProcAudit:流程意见
  modiWorkflowAudit(WorkStateKeyword, CheckerKeyword, CheckDate, ProcAudit, DeProcAudit) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'ModiWorkflowAudit',
      sid,
      WorkStateKeyword,
      CheckerKeyword,
      CheckDate,
      ProcAudit,
      DeProcAudit
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //删除流程
  //Keyword:流程，文档或目录的关键字
  deleteWorkFlow(Keyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'DeleteWorkFlow',
      sid,
      Keyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //流程文档创建人撤回流程
  //Keyword:流程，文档或目录的关键字
  revokeWorkFlow(Keyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'RevokeWorkFlow',
      sid,
      Keyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //撤销提交流程
  //Keyword:流程，文档或目录的关键字
  rebackWorkFlow(Keyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.WorkFlowController',
      A: 'RebackWorkFlow',
      sid,
      Keyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
}
