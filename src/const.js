/*
 * @Author: CiFong
 * @Date: 2020-04-03 13:51:19
 * @LastEditors: CiFong
 * @LastEditTime: 2020-04-07 10:14:07
 * @Description: 请输入
 */

export const BASE_URL = (() => {
    // 默认的url
    let baseUrl = "http://jhcdms.f3322.net:81"
    const configUrl = "/config.json"

    let request = new XMLHttpRequest()
    request.open("GET", configUrl, false)
    request.send(null)
    if (request.status === 200) {
        try {
            let data = request.responseText
            data = JSON.parse(data)
            baseUrl = data.BASE_URL
            console.log("获取到 BASE_URL: " + baseUrl)
        } catch(err) {
            console.log(err)
        }
    }
    return baseUrl
})()

// 81 端口
// {
//     "BASE_URL": "http://jhcdms.f3322.net:81",
//     "PluginsList": ["I3VTDPlugin"]
// }

// 8090端口
// {
//     "BASE_URL": "http://jhcdms.f3322.net:8090",
//     "PluginsList": ["FYPlugin"]
// }


// export const BASE_URL = 'http://jhcdms.f3322.net:81';       // teamviewer连接
// export const BASE_URL = 'http://jhcdms.f3322.net:8099';     // 新的客户端链接
// export const BASE_URL = 'http://192.168.10.200:81'
// export const BASE_URL = 'http://106.75.71.90'
// export const BASE_URL = 'http://192.168.110.1:8089';   //自己本地的
// export const BASE_URL = 'http://jhcdms.f3322.net:8090';       // teamviewer连接
// export const BASE_URL = 'http://jhcdms.f3322.net:8098'
//export const BASE_URL = 'http://localhost';       // teamviewer连接
// export const BASE_URL = 'http://jhcdms.f3322.net:8090';       // teamviewer连接
// export const BASE_URL = 'http://i3vmsweb.i3vgroup.cn';  // 测试服务器
// export const BASE_URL = 'http://localhost:80' // 新部署主机

// 微软线上预览
export const VIEW_DOC = 'https://view.officeapps.live.com/op/view.aspx?src=';

export const TemplateDocIcon = require('@/assets/templateIcon/Document.png');

export const TemplateProIcon = require('@/assets/templateIcon/Project.png');


// bos 系统
export const BOS_BASE_URL = 'http://139.9.215.236:8080'
// export const BOS_BASE_URL = 'http://bosgw.bimwinner.com'
// 预览三维网址
export const HOST3D = "http://139.9.215.236:82";
// export const HOST3D = 'http://bos3d.bimwinner.com'



// 使用的插件
//  8090端口，方圆
// export const PluginsList = ["FYPlugin"]
// // 81端口
// export const PluginsList = ['I3VTDPlugin']

export const PluginsList = (() => {
    const configUrl = "/config.json"
    let request = new XMLHttpRequest()
    request.open("GET", configUrl, false);
    request.send(null)
    // 默认使用插件
    let basePluginsList = ['I3VTDPlugin']
    if (request.status === 200) {
        try {
            let data = request.responseText
            data = JSON.parse(data)
            basePluginsList = data.PluginsList
            console.log("获取到 PluginsList: " + basePluginsList)
        } catch(err) {
            console.log(err)
        }
    }
    return basePluginsList
}) ()


export const bosConfig = {
    name: 'i3v_02',
    password: '123456a',
    appKey: 'a3dc301d189f4ce58729a08fbac1b8b5',
    // appKey: 'e9e2de43fc4c450c8f715b97505658ba'
}
// 可以接受的模型类型
export const MODEL_TYPES = ["zip", "ifc", "imodel", "obj", "fbx", "dae"];

// 客户端下载链接
export const client_download_url = 'http://jhcdms.f3322.net:81/ISO/Client/i3vmsme.exe';
export const client_name = 'i3vmsme.exe'