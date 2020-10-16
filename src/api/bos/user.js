import request from '../bosBaseAxios'
import Qs from 'qs'
// import store from '@/store'

/**
 * 
 * @param {String} name - 用户名
 * @param {String} password - 秘密
 * @param {String} appKey - 应用的key
 * @param {String} isRemember = [true | false] 是否记住密码，true 的话 token 4天有效，否则 1 天
 * 
 */
export function login(name, password, appKey, isRemember) {
    let data = new FormData()
    data.append('name', name)
    data.append('password', password)
    data.append('appKey', appKey)
    data.append('isRemember', isRemember || 'true')

    return request({
        url: `boscenterservice/account/login`,
        data,
        method: 'post',
        headers: {
            "Content-Type": 'multipart/form-data'
        },
        
    })
}

