// bos 所有模块api的入口文件

import * as user from './user.js'
import * as model from './model.js'

const api = {
    user: {
        ...user
    },
    model: {
        ...model
    }
}

export default api