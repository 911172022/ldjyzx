import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
  //获取文件夹列表
  getProjectList(node, ProjectType) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetProjectListJson',
      sid,
      ProjectType,
      node
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取Project的完整目录路径
  getProjectShowPath(ProjectKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetProjectShowPath',
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
  //获取文件夹基本属性
  getProjectBaseAttr(ProjectKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetProjectBaseAttrByKeyword',
      sid,
      ProjectKeyword
    })
    return request({
      url: `WebApi/get/?${data}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取文件夹附加属性
  getProjectAttrData(ProjectKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetProjectAttrDataByKeyword',
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
  //获取目录的用户和用户组权限列表
  getProjectRightList(ProjectKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetProjectRightList',
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
  //更新project属性，属性页
  updateProjectAttr(projectKeyword, projectAttrJson) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'UpdateProjectAttr',
      sid,
      projectKeyword,
      projectAttrJson: JSON.stringify(projectAttrJson)
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //返回一个Project对象下所有子project的文档合计数量
  //ProjectList: projectKeyword
  getChildsDocsCount(ProjectList) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetChildsDocsCount',
      sid,
      ProjectList
    })
    return request({
      url: `WebApi/Post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data
    })
  },
  //获取按钮权限
  //Menu可以是以下字符串的其中之一:
  //新建文档, 复制创建文档 CreateNewDoc
  //新建目录, 复制创建目录 CreateNewProject
  //修改目录模板 ModiProjAttr
  //CreateNewProjec,CreateNewRootProject,CreateNewDoc,ModiProjAttr
  getMenuRight(ProjectKeyword, Menu) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetMenuRight',
      sid,
      ProjectKeyword,
      Menu
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //创建目录
  createProject(projectKeyword, projectAttrJson) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'CreateProject',
      sid,
      projectKeyword,
      projectAttrJson: JSON.stringify(projectAttrJson)
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取目录属性,在调用目录的“新建目录”菜单和“编辑属性”菜单，初始化表单时使用
  //action: "ModiProject"和"CreateProject"其中之一
  getProjectAttr(action, ProjectKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetProjectAttr',
      sid,
      action,
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
  //删除目录
  delProject(ProjectKeyword, sureDel) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'DelProject',
      sid,
      ProjectKeyword,
      sureDel
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //创建个人工作台，逻辑目录，或者查询
  newGlobalOrUserProject(projectKeyword, projectCode, projectDesc, projectType, SQLString) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'NewGlobalOrUserProject',
      sid,
      projectKeyword,
      projectCode,
      projectDesc,
      projectType,
      SQLString
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //获取Project的完整目录路径
  getProjectPath(Keyword, IgnoreShortCut) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetProjectPath',
      sid,
      Keyword,
      IgnoreShortCut
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //设置目录权限
  saveLastProject(ProjectKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'SaveLastProject',
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
  //返回Project模板下所有Project和Doc子模板列表
  //node: projectKeyword
  getTempDefList(node) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetTempDefList',
      sid,
      node
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //设置目录权限
  setProjectRightList(ProjectKeyword, rightAttrJson) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'SetProjectRightList',
      sid,
      ProjectKeyword,
      rightAttrJson: JSON.stringify(rightAttrJson)
    })
    return request({
      url: `WebApi/Post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    })
  },
  //根据模板创建各级子Project，projects是用','分割的project关键字
  createProjectByDef(Projects) {
    const sid = store.getters.sid
    let data = new FormData()
    data.append("sid", sid)
    data.append("C", 'AVEVA.CDMS.WebApi.ProjectController')
    data.append("A", 'CreateProjectByDef')
    data.append("Projects", JSON.stringify(Projects))
    return request({
      url: `WebApi/Post`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  },
  //获取各级子Project
  //node: projectKeyword
  //level = '3'：需要添加的目录层级，0为无限级
  //peer = 'false'是否需要获取同级目录
  getProjectListWithLevel(node, Level, peer) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'getProjectListWithLevel',
      sid,
      node,
      ProjectType: '1',
      Level,
      peer
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //在目录下粘贴一个目录或文档
  projectPaste(ProjectKeyword, ObjectKeyword, isCut) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'ProjectPaste',
      sid,
      ProjectKeyword,
      ObjectKeyword,
      isCut
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //在目录下粘贴一个目录或文档的快捷方式
  projectPasteShortcut(ProjectKeyword, ObjectKeyword, isCut) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'ProjectPasteShortcut',
      sid,
      ProjectKeyword,
      ObjectKeyword,
      isCut
    })
    return request({
      url: `WebApi/Post/?${data}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  // 文档查询页，右键一个查询，编辑查询属性，调用这个接口，查询该查询的信息
  getGlobalOrUserProject(ProjectKeyword) {
    const sid = store.getters.sid
    const data = Qs.stringify({
      C: 'AVEVA.CDMS.WebApi.ProjectController',
      A: 'GetGlobalOrUserProject',
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
  // 编辑查询条件
  updateGlobalOrUserProject(projectKeyword, projectCode, projectDesc, SQLString) {
    const sid = store.getters.sid
    const data = Qs.stringify({
        C: 'AVEVA.CDMS.WebApi.ProjectController',
        A: 'UpdateGlobalOrUserProject',
        sid,
        projectKeyword,
        projectCode,
        projectDesc,
        SQLString,
        projectType: 6
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
