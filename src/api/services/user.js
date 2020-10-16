import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
  //返回用户列表（包括子用户组的用户）
  getAllUserList(page, limit, Group, filter = '') {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'GetAllUserList',
      sid,
      page,
      limit,
      Group,
      filter
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //返回用户组对象下的子用户组列表
  getUserGroupList(node, GroupType, Filter) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'GetUserGroupList',
      sid,
      node,
      GroupType,
      Filter
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取用户信息
  getUserInfo(UserKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'GetUserInfo',
      sid,
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
  //修改用户信息
  saveUserInfo(UserKeyword, UserCode, UserDesc, UserEmail, UserType, UserStatus, Phone, UserPwd, UserConfirmPwd) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'SaveUserInfo',
      sid,
      UserKeyword,
      UserCode,
      UserDesc,
      UserEmail,
      UserType,
      UserStatus,
      Phone,
      UserPwd,
      UserConfirmPwd
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //新建用户
  createUser(UserCode, UserDesc, UserEmail, UserType, UserStatus, Phone, UserPwd, UserConfirmPwd) {
    console.log(UserCode, UserDesc, UserEmail, UserType, UserStatus, Phone, UserPwd, UserConfirmPwd)
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'CreateUser',
      sid,
      UserCode,
      UserDesc,
      UserEmail,
      UserType,
      UserStatus,
      Phone,
      UserPwd,
      UserConfirmPwd
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //删除用户
  dropUser(UserKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'DropUser',
      sid,
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
  //返回用户列表（不包括子用户组的用户）G
  getUserList(page, limit, Group, filter) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'GetUserList',
      sid,
      page,
      limit,
      Group,
      filter
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //添加目录到用户收藏夹
  addFavorites(ProjectKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'AddFavorites',
      sid,
      ProjectKeyword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取用户收藏夹列表
  getFavoritesList() {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'GetFavoritesList',
      sid
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //修改用户密码
  setUserPassword(OldPassword, NewPassword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'SetUserPassword',
      sid,
      OldPassword,
      NewPassword
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //检查sid是否可用
  getNavigationDisplay(sid) {
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.UserController',
      A: 'CheckSid',
      sid
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
