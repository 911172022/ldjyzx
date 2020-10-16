// import store from '@/store'
import axios from 'axios'
// import router from '../router'
import router from '../../../router'
import { Message } from 'element-ui'
// import UserApi from './services/user'

// 显示错误
function errorLog(error) {
    // 显示提示
    Message({
        message: error.message,
        type: 'error',
        duration: 10 * 1000
    })
}
// let requestConfig = {
//   timeout: 10000 // 请求超时时间
// }

// 跨域
const {
    BASE_URL
} = require("../../../const");

// 上传的超时时间应该长一点
let requestConfig = {
    baseURL: process.env.NODE_ENV === "production" ? BASE_URL : "",  //  用于开发环境解决跨域
    timeout: 1000 * 60  //  请求超时时间
}

// 创建一个 axios 实例
const service = axios.create(requestConfig)

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
            // 如果是 超时了也把response转过去
            return dataAxios.data
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400: error.message = '请求错误'; break
                case 401: error.message = '未授权，请登录'; break
                case 403: error.message = '拒绝访问'; break
                case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
                case 408: error.message = '请求超时'; break
                case 500: error.message = '服务器内部错误'; break
                case 501: error.message = '服务未实现'; break
                case 502: error.message = '网关错误'; break
                case 503: error.message = '服务不可用'; break
                case 504: error.message = '网关超时'; break
                case 505: error.message = 'HTTP版本不受支持'; break
                default: break
            }
        }
        // errorLog(error)
        // 将报错放到调用上传文件接口的判断里
        return Promise.reject(error)
    }
)

export default service
