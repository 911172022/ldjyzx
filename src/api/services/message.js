import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {

  //获取Message消息类别对象下子Message树节点列表
  getMessageTree(node) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.MessageController',
      A: 'GetMessageTree',
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
  //返回MessageList的JSON对象
  getMessageList(MessageType, page, limit) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.MessageController',
      A: 'GetMessageList',
      sid,
      MessageType,
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
  //返回Message的JSON对象
  getMessage(MessageKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.MessageController',
      A: 'GetMessage',
      sid,
      MessageKeyword
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  SetMessageRead(MessageKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.MessageController',
      A: 'SetMessageRead',
      sid,
      MessageKeyword
    })
    return request({
      url: `WebApi/post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // 发送消息
  sendMessage(RecUserlist, CCUserlist, Title, Content, Attalist) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.CDMS.WebApi.MessageController')
    data.append("A", 'SendMessage')
    data.append("RecUserlist", RecUserlist)
    data.append("CCUserlist", CCUserlist)
    data.append("Title", Title)
    data.append("Content", Content)
    data.append("Attalist", Attalist)
    return request({
      url: `WebApi/Post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  },
  // 删除消息
  deleteMessage(MessageKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.MessageController',
      A: 'DeleteMessage',
      sid,
      MessageKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // 保存草稿消息，当MessageKeyword为空时，创建草稿消息
  saveDraftMessage(MessageKeyword, RecUserlist, CCUserlist, Title, Content, Attalist) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.CDMS.WebApi.MessageController')
    data.append("A", 'SaveDraftMessage')
    data.append("MessageKeyword", MessageKeyword)
    data.append("RecUserlist", RecUserlist)
    data.append("CCUserlist", CCUserlist)
    data.append("Title", Title)
    data.append("Content", Content)
    data.append("Attalist", Attalist)
    return request({
      url: `WebApi/Post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  },
  getUserNoReadMessageList() {
    const sid = store.getters.sid;
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.MessageController',
      A: 'GetUserNoReadMessageList',
      sid,
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

