import request from '../bosBaseAxios'

/**
 * 
 * @param { String } name - 模型名称（不带扩展名）
 * @param { File } file - 模型文件（模型文件(支持ifc、rvt、imodel、obj、fbx、dae模型，若为rvt、imodel、obj、fbx和dae模型请压缩为zip格式，若为ifc模型可直接上传)）
 * @param { String } url - 网络下载地址
 * @param { String }  type - 模型类型（选填，IFC/REVIT/IMODEL/OBJ/FBX/DAE 之一）
 * 
 */
export function uploadModel(name = '', file, url = '', type = '', onUploadProgress = () => {}) {
    let data = new FormData()
    !name || data.append('name', name);
    !url || data.append('url', url);
    !type || data.append('type', type);
    !file || data.append('file', file)


    let projectKey = localStorage.getItem('bos_projectKey')
    console.log('projectKey: ', projectKey)
    return request({
        url: `bos3dengine/api/${projectKey}/files`,
        data,
        method: 'post',
        headers: {
            "Content-Type": 'multipart/form-data'
        },
        onUploadProgress,
    })
}


/**
 * 请求解析模型文件
 * @param { String } fileKey - 上传完模型之后得到的 key
 * @param { String } priority - priority选填，表示解析优先级，默认为0，此时按队列顺序解析；	如模型文件此前已经解析过，则返回模型当前解析状态； 如需优先解析，可设置为1，此时插入到当前解析队列最前端，优先解析；如模型文件为首次请求解析，可以通过参数permission设置模型浏览权限，默认为模型所在数据库的访问权限，可以设置为public（不限制）、system（BOS用户可以浏览）、private（仅本人可以浏览）或BOS 应用的key（该BOS应用的用户可以浏览）；如用户未登录或文件无创建者，则仅可为public。
 * @param { String }  permission - 模型浏览的权限
 * 
 */
export function parsesModel(fileKey, priority = 0, permission = 'public') {
    let projectKey = localStorage.getItem('bos_projectKey')

    return request({
        url: `bos3dengine/api/${projectKey}/parses/files`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
            fileKey,
            priority,
            permission
        }
    })
}

/**
 * 查询模型文件解析进展
 * @param { String } modelKey - 模型 Key
 * 
 */
export function parsesStatus(modelKey) {
    let projectKey = localStorage.getItem('bos_projectKey')

    return request({
        url: `bos3dengine/api/${projectKey}/parses/status?modelKey=${modelKey}`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    })
}