import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'


export default {
  /// 获取菜单列表
  /// ProjectList:选中的Project列表
  /// DocList:选中的Doc列表
  /// Position:菜单的位置，有四个选项：TVProject = 0,LVProject = 1,LVDoc = 2,LVMultiSelected = 3
  /// 返回JObject,有四个参数：success:是否操作成功,total:记录总数,msg:错误消息,data(JArray字符串):返回的数据。
  /// 操作成功时，success返回true,操作失败时在msg里返回错误消息
  /// 操作成功时，data包含多个JObject，每个JObject包含：
  /// "Id"：菜单Id,"Name":菜单名，"State"：菜单状态，（禁用，启用），"Position"：菜单位置
  getMenuList(ProjectList, Position, TvPosition) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.DBSourceController',
      A: 'GetMenuList',
      sid,
      ProjectList,
      Position,
      TvPosition
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // 跨域
  login(UserName,  Password)  {
        const  data  =  Qs.stringify({
            C:  'AVEVA.CDMS.WebApi.DBSourceController',
            A:  'Login',
            UserName,
            Password
        })
        return  request({
            url:  `WebApi/Get/?${data}`,
            method:  'get',
            headers:  {
                'Content-Type':  'application/json'
            }
        })

    }
}
