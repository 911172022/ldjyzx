import request from './BaseAxios'
export default {
  login(data) {
    return request({
      url: 'WebApi/Login',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }
}
