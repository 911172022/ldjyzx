import request from './BaseAxios'

export const login = (data) => {
  return request({
    url: 'login',  //登陆
    method: 'get',
    params: data,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export const loginOut = (data) => {
  return request({
    url: 'logout',  //登出
    method: 'get',
    params: data,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}
