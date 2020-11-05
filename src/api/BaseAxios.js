// import store from '@/store'
import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'
import store from "@/store"
// import UserApi from './services/user'

// 跨域
const  {
    BASE_URL
}  =  require("../const.js");

let  requestConfig  =  {
    baseURL:  process.env.NODE_ENV  ===  "production"  ?  BASE_URL  :  BASE_URL,  //  用于开发环境解决跨域
    timeout:  10000  //  请求超时时间
}

// 创建一个 axios 实例
const service = axios.create(requestConfig)

// 请求拦截器
service.interceptors.request.use(
  config => {
    let token = localStorage.getItem("LOGIN")
    // let token = store.state.token;
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => {
    // 发送失败
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response
    // 这个状态码是和后端约定的
    const { status } = dataAxios
    const { msg } = dataAxios.data
    // 根据 code 进行判断
    if (msg === '登录验证失败！请尝试重新登录！' || msg === '从不同步的代码块中调用了对象同步方法。') {
      // Message.error(msg)
      router.push({ path: '/login' })
      return
    }
    // 根据 code 进行判断
    if (status === undefined) {
      // 如果没有 code 代表这不是项目后端开发的接口
      return dataAxios
    } else {
      // 有 code 代表这是一个后端接口 可以进行进一步的判断
      switch (status) {
        case 200:
          // [ 示例 ] code === true 代表没有错误
          return dataAxios.data
        case 400:
          // [ 示例 ] 其它和后台约定的 code
          router.push({ name: 'login' });
          break
        default:
          // 不是正确的 code
          router.push({ name: 'error' });
          break
      }
    }
  }
)

export default service
