import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'


export default {
  //删除用户组
  dropGroup(groupKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.GroupController',
      A: 'DropGroup',
      sid,
      groupKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //删除组的用户
  dropUser(groupKeyword, userKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.GroupController',
      A: 'DropUser',
      sid,
      groupKeyword,
      userKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //向用户组添加用户
  addUser(groupKeyword, userKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.GroupController',
      A: 'AddUser',
      sid,
      groupKeyword,
      userKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //创建一个用户组Group 
  newGroup(groupCode, groupDesc, parentGroup) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.GroupController',
      A: 'NewGroup',
      sid,
      groupCode,
      groupDesc,
      parentGroup
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
