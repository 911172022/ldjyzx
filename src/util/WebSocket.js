// socket功能
import store from '../store/index.js'

const docStatus = {
    CheckOut: '检出',
    CheckIn: "检入",
    ReadOnlyOpen: '只读'
}

export function connectionWebSocket() {
    if (window.cdmsws == undefined){
        window.cdmsws = new WebSocket("ws://127.0.0.1:21992");
        console.log(window.cdmsws)
        window.cdmsws.onopen = function() { 
            console.log('websocket open')
            window.cdmsws.send('websocekt测试'); 
        };
        window.cdmsws.onmessage = function(e) {
            if (window.cdmswsonline==undefined || window.cdmswsonline=="false"){
                window.cdmswsonline = "true";
            }
            //alert("收到服务端的消息：" + e.data);
            console.log(e.data)
            try {
                let data = JSON.parse(e.data)
                // for(let i in data) {
                //     store.commit('download/UPDATE_DOWNLOAD_TASKS', data[i])
                // }
                // 更新下载进度
                if (data.funcname === 'getDownloadingFile') {
                    for(let i in data.data) {
                        store.commit('download/UPDATE_DOWNLOAD_TASKS', data.data[i])
                    }
                } else if (data.funcname === 'getDownStatusChange') {
                    // 更改下载状态
                    for(let i in data.data) {
                        store.commit('download/UPDATE_DOWNLOAD_TASKS', data.data[i])
                    }
                } else if (data.funcname === 'getDocStatusChange') {
                    // 更改文件状态，这里默认FLocker 是自己
                    for(let i in data.data) {
                        store.dispatch("doc/setDocStatus", {
                            docKeyword: data.data[i].docKeyword,
                            status: docStatus[data.data[i].status],
                            locker: docStatus[data.data[i].status] === docStatus.CheckOut ? store.state.userData.userkeyword: null
                        })
                    }
                }





            } catch(err) {
                console.log(err)
            }
            //const sid = this.$store.getters.sid;
            //ws.send('cdmsme://funcname~~~' + 'downloadfile' + '~~~' + 'dockeyword' + '~~~' );//+ docKeyword + '~~~' + 'sid'+'~~~'+ sid);
        };
    }
}