import uploadApi from "../components/UploadFiles/api/uploadApi";
// element-ui 的消息提示
import { Message } from 'element-ui'
import { makeDialog } from "../util/Common"
import { TimeChange } from "../util/Time";
import Vue from 'vue'

// 定义分块大小
const SIZE = 1024 * 1024 * 0.25
// 任务状态表
const tasksStatus = {
    // 还在fileList，需要请求上传的任务信息的
    BEFORE_UPLOAD: 0,
    // 在uploadList里等待上传的
    WAITING_UPLOAD: 1,
    // 在uploadList里正在上传的
    UPLOADING: 2,
    // 任务完成
    COMPLETED: 3,
    // 暂停了的
    PAUSE: 4,
    // 被移除任务的
    REMOVE: 5,
}

const upgradeOrOverwrite = {
    // 全部升级
    ALL_UPGRADE: 0,
    // 单个升级
    UPGRADE_ALONE: 1,
    // 全部覆盖
    ALL_OVERWRITE: 2,
    // 单独覆盖
    OVERWRITE_ALONE: 3
}


export default {
    namespaced: true,
    state: {
        // 上传的文件列表队列，在真正上传前存放的地方
        fileList: [],
        /**
         *  真正需要上传前，已经准备好docKeyword,fullServerFilePath等
         *  Keyword: "GJEPCMSP6185D7377"
            O_filename: "texcel.xlsx"
            completed: false
            confirmUpgrade: ""
            fileChunks: [{…}]
            fileUploadedSize: "0"
            isDuplicate: false
            msg: ""
            pause: false
            progressPercent: 0
            rawFile: Object
            remove: false
            serverFullFileName: "d:/GJEPCStorage/CDMS0006185/texcel.xlsx"
            serverInfo: {Keyword: "GJEPCMSP6185D7377", O_itemno: "7377", Title: "texcel", O_size: "0.00 B", O_filename: "texcel.xlsx"
         * 
         * 
         */
        uploadList: [],
        // 用文件在上传的状态
        uploading: false,
        // 上传速度
        uploadSpeed: 0
    },
    mutations: {
        /**
         * 设置fileList
         * @param {*} state 
         * @param {*} status elementui那个上传选择了之后的fileList 
         */
        SET_FILE_LIST(state, status) {
            state.fileList = []
            state.fileList = status.map(i => {
                return {
                    rawFile: {
                        ...i,
                        uid: i.uid || new Date().getTime() + i.raw.lastModified + Math.floor((Math.random() * 100) + 1)
                    },
                    // 任务状态
                    status: tasksStatus.BEFORE_UPLOAD,
                    // 升级或覆盖操作，默认''，之后的操作会更改
                    confirmUpgrade: "",
                    // 文件上传进度
                    progressPercent: 0,
                    // 任务状态信息
                    msg: '',
                    // * 归属的目录
                    projectKeyword: i.projectKeyword,
                }
            })
        },
        /**
         * 指定信息地设置fileList
         * @param {*} state 
         * @param {*} status 
         */
        SET_FILE_LIST_SPECIFY(state, status) {
            state.fileList = []
            state.fileList = status.map(i => {
                return {
                    rawFile: {
                        ...i,
                        uid: i.uid || new Date().getTime() + i.raw.lastModified + Math.floor((Math.random() * 100) + 1)
                    },
                    // 任务状态
                    status: tasksStatus.BEFORE_UPLOAD,
                    // 升级或覆盖操作，默认''，之后的操作会更改
                    confirmUpgrade: "",
                    // 文件上传进度
                    progressPercent: 0,
                    // 任务状态信息
                    msg: '',
                    // * 归属的目录
                    projectKeyword: i.projectKeyword,
                    // docKeyword
                    keyword: i.docKeyword,
                    O_filename: i.filename
                }
            })
            console.log(state.fileList)
        },
        /* -------------------------------------------------------------- */
        // before upload 前操作
        // 检查空文件，踢出队列
        CHECK_EMPTY_FILE(state) {
            for(let i in state.fileList) {
                if (state.fileList[i].rawFile.raw.size === 0) {
                    Message.warning({
                        message: `请勿上传空文件：空文件${ state.fileList[i].rawFile.name }`
                    })
                    // 将空文件任务踢出
                    state.fileList[i].status = tasksStatus.REMOVE
                    state.fileList[i].msg = '空文件'
                }
            }
        },
        /**
         * 更新fileList内某个文件的信息
         * @param {*} state 
         * @param {Object} status {
         *  i: 要更新的下标
         *  file: 要替换的信息
         * } 
         */
        UPDATE_FILE_LIST(state, status) {
            state.fileList[status.i] = status.file
            console.log(state.fileList[status.i])
        },
        /**
         * 更新 uploadList 内某个文件的信息
         * @param {*} state 
         * @param {Object} status {
         *  i: 要更新的下标
         *  file: 要替换的信息
         * } 
         */
        UPDATE_UPLOAD_LIST(state, status) {
            for(let i in status.file) {
                Vue.set(state.uploadList[status.i], i, status.file[i])
            }
        },
        /**
         * 将 fileList 里的内容移到uploadList里，清空fileList
         * @param {*} state 
         */
        ADD_UPLOAD_LIST(state) {
            let newList = state.fileList.filter(i => i.status == tasksStatus.BEFORE_UPLOAD).map(i => {
                return {
                    ...i,
                    status: tasksStatus.WAITING_UPLOAD
                }
            })
            // 先遍历原有的uploadList，要暂停掉相同keyword的
            let keywordList = newList.map(i => i.keyword)
            for (let i in state.uploadList) {
                if (keywordList.includes(state.uploadList[i].keyword)) {
                    if(state.uploadList[i].status === tasksStatus.UPLOADING || state.uploadList[i].status === tasksStatus.WAITING_UPLOAD) {
                        state.uploadList[i].status = tasksStatus.PAUSE
                        state.uploadList[i].msg = '相同文档上传任务'
                    }
                }
            }
            for(let i in newList) {
                state.uploadList.push(newList[i])
            }

            state.fileList = []
        },
        // 设置正在上传的状态
        SET_UPLOADING(state, status) {
            state.uploading = status
        },
        // 设置上传速度
        SET_UPLOAD_SPEED(state, status) {
            state.uploadSpeed = status
        },
        /**
         * 设置某个分块上传完成
         * @param {*}} state 
         * @param {Object} status 
         */
        SET_UPLOADED_MARK(state, status) {
            state.uploadList[status.i].fileChunks[status.j].uploaded = true
        },
        /**
         * 暂停一个任务
         * @param {*} state 
         * @param {*} status 任务的uid 
         */
        PAUSE_TASKS(state, status) {
            for(let i in state.uploadList) {
                if (state.uploadList[i].rawFile.uid === status) {
                    state.uploadList[i].status = tasksStatus.PAUSE
                    state.uploadList[i].msg = '手动暂停'
                    break
                }
            }
        },
        /**
         * 重新开始一个任务
         * @param {*} state 
         * @param {*} status 任务的uid 
         */
        RESTART_TASKS(state, status) {
            for(let i in state.uploadList) {
                if (state.uploadList[i].rawFile.uid === status) {
                    state.uploadList[i].status = tasksStatus.WAITING_UPLOAD
                    state.uploadList[i].msg = ''
                    break
                }
            }
        },
        test_add_tasks(state, status) {
            state.uploadList.push(status)
        }
    },
    actions: {
        /* ---------------------------------------------------------- */
        // 在放到uploadList前的操作，获取上传所需的信息

        // 1 (a) ——> 直接根据文件名创建一个文档然后上传的操作从这里开始
        async beforeUploadCreateDoc({ state, commit, dispatch }) {
            // 全部升级
            let allUpgrade = false
            // 全部覆盖
            let allCover = false

            // 1. 踢出空文件
            commit("CHECK_EMPTY_FILE")
            // 2. 检查文件是否重复的
            //    遍历fileList访问CreateDocByFileName接口，根据返回的数据给fileList那一项加入状态标记
            //    添加文档信息
            for (let i in state.fileList) {
                if (state.fileList[i].status != tasksStatus.BEFORE_UPLOAD) {
                    continue;
                }

                let res = await uploadApi.CreateDocByFileName(
                    state.fileList[i].projectKeyword,
                    state.fileList[i].rawFile.name,
                    // 第一次访问这个接口，confirmUpgrade默认值为''
                    state.fileList[i].confirmUpgrade
                )

                // createDocByFileName 返回成功操作
                if (res.success) {
                    if (res.msg === 'ConfirmUpgrade') {
                        if (!allUpgrade && !allCover) {
                            let result = await makeDialog({
                                title: '确认文件替换',
                                content: `目录下已存在同名文件${ state.fileList[i].rawFile.name } 是否升级或覆盖`,
                                operation: [
                                    {
                                        text: '升级',
                                        value: upgradeOrOverwrite.UPGRADE_ALONE,
                                    },
                                    {
                                        text: '全部升级',
                                        value: upgradeOrOverwrite.ALL_UPGRADE,
                                    },
                                    {
                                        text: '覆盖',
                                        value: upgradeOrOverwrite.OVERWRITE_ALONE
                                    },
                                    {
                                        text: '全部覆盖',
                                        value: upgradeOrOverwrite.ALL_OVERWRITE
                                    }
                                ]
                            })
    
                            if (result.success) {
                                if ((result.result === upgradeOrOverwrite.OVERWRITE_ALONE) || (result.result === upgradeOrOverwrite.ALL_OVERWRITE)) {
                                    commit("UPDATE_FILE_LIST", {
                                        i,
                                        file: {
                                            ...state.fileList[i],
                                            confirmUpgrade: "false",
                                        }
                                    })
                                }

                                if ((result.result === upgradeOrOverwrite.UPGRADE_ALONE) || (result.result === upgradeOrOverwrite.ALL_UPGRADE)) {
                                    commit("UPDATE_FILE_LIST", {
                                        i,
                                        file: {
                                            ...state.fileList[i],
                                            confirmUpgrade: "true",
                                        }
                                    })
                                }
                                
                                if (result.result === upgradeOrOverwrite.ALL_OVERWRITE) {
                                    allCover = true
                                }
                                
                                if (result.result === upgradeOrOverwrite.ALL_UPGRADE) {
                                    allUpgrade = true
                                }
                            } else {
                                // 用户没选任何一项，关闭了弹窗，视为取消上传
                                commit("UPDATE_FILE_LIST", {
                                    i,
                                    file: {
                                        ...state.fileList[i],
                                        status: tasksStatus.REMOVE
                                    }
                                })
                            }
                        } else {
                            if (allCover) {
                                commit("UPDATE_FILE_LIST", {
                                    i,
                                    file: {
                                        ...state.fileList[i],
                                        confirmUpgrade: "false",
                                    }
                                })
                            } else if (allUpgrade) {
                                commit("UPDATE_FILE_LIST", {
                                    i,
                                    file: {
                                        ...state.fileList[i],
                                        confirmUpgrade: "true",
                                    }
                                })
                            }
                        }
                    } else {
                        commit("UPDATE_FILE_LIST", {
                            i,
                            file: {
                                ...state.fileList[i],
                                keyword: res.data[0].Keyword,
                                O_filename: res.data[0].O_filename,
                                serverInfo: res.data[0],
                            }
                        })
                    }
                } else {
                    commit("UPDATE_FILE_LIST", {
                        i,
                        file: {
                            ...state.fileList[i],
                            status: tasksStatus.REMOVE,
                            msg: res.msg
                        }
                    })
                    Message.error({
                        message: `创建文档失败：${ res.msg }`
                    })
                }
            }

            // 第二次遍历，检查过有没有重复了
            for(let i in state.fileList) {
                if (state.fileList[i].status != tasksStatus.BEFORE_UPLOAD) {
                    continue
                }

                if (state.fileList[i].keyword) {
                    continue
                }

                let res = await uploadApi.CreateDocByFileName(
                    state.fileList[i].projectKeyword,
                    state.fileList[i].rawFile.name,
                    // 第一次访问这个接口，confirmUpgrade默认值为''
                    state.fileList[i].confirmUpgrade
                )
                if (res.success) {
                    if (!res.msg) {
                        commit("UPDATE_FILE_LIST", {
                            i,
                            file: {
                                ...state.fileList[i],
                                keyword: res.data[0].Keyword,
                                O_filename: res.data[0].O_filename,
                                serverInfo: res.data[0]
                            }
                        })
                    }
                } else {
                    commit("UPDATE_FILE_LIST", {
                        i,
                        file: {
                            ...state.fileList[i],
                            status: tasksStatus.REMOVE,
                            msg: res.msg
                        }
                    })
                    Message.error({
                        message: `创建文档失败：${ res.msg }`
                    })
                }
            }

            dispatch({
                type: 'beforeUploadFiles'
            })
            return Promise.resolve()
        },
        // 1 (b) 指定 docKeyword 和 O_filename 的，在这里，注意这里传单个任务进来
        // keyword: res.data[0].Keyword,
        // O_filename: res.data[0].O_filename,
        async specifyUploadInfo({ commit, dispatch }, payload) {
            commit('SET_FILE_LIST_SPECIFY', [payload.file])
            commit('CHECK_EMPTY_FILE')
            dispatch("beforeUploadFiles")
        },
        // 2. ——> 设置好了要上传的文档信息之后，到这里准备上传
        async beforeUploadFiles({ state, commit, dispatch }) {
            for(let i in state.fileList) {
                if (state.fileList[i].status != tasksStatus.BEFORE_UPLOAD) {
                    continue;
                }

                let ObjectKeyword = state.fileList[i].keyword,
                    ServerFileName = state.fileList[i].O_filename,
                    CreateDate = "",
                    ModifyDate = TimeChange(
                        state.fileList[i].rawFile.raw.lastModifiedDate
                    ),
                    fileSize = state.fileList[i].rawFile.raw.size;
                console.log(ServerFileName)
                // 将文件的信息传入 beforeUploadFile
                let res = await uploadApi.beforeUploadFile(
                    ObjectKeyword,
                    ServerFileName,
                    CreateDate,
                    ModifyDate,
                    fileSize
                );

                // 成功后操作
                if (res.success) {
                    if (res.data[0].resultValue === -1 || res.data[0].resultValue === '-1') {
                        // 说明这个是重复文件，系统里有这个文件
                        commit("UPDATE_FILE_LIST", {
                            i,
                            file: {
                                ...state.fileList[i],
                                status: tasksStatus.REMOVE,
                                msg: '系统存在相同文件'
                            }
                        })
                        Message.warning({
                            message: `系统存在相同文件：${ state.fileList[i].rawFile.name }，请勿重复上传`,
                        })
                    } else {
                        let fileChunks = [];
                        let cursor = 0;
                        while (cursor < state.fileList[i].rawFile.size) {
                            fileChunks.push({
                                file: state.fileList[i].rawFile.raw.slice(
                                    cursor,
                                    cursor + SIZE
                                ),
                                uploaded:
                                    res.data[0].resultValue > cursor
                                        ? true
                                        : false
                            });
                            cursor += SIZE;
                        }


                        // 记录 ServerFullFileName 和 fileUploadedSize
                        // fileUploadedSize 为是否已经上传过这个文件（指上传过但没上传完成，用于断点续传）
                        commit("UPDATE_FILE_LIST", {
                            i,
                            file: {
                                ...state.fileList[i],
                                serverFullFileName: res.data[0].ServerFullFileName,
                                fileUploadedSize: res.data[0].resultValue,
                                fileChunks,
                            }
                        })
                    }
                }
                // 如果失败了就将这个文件踢出队列
                else {
                    // 有错，将该文件 pause 设为 true
                    // this.fileList[i].pause = true;
                    // 直接将文件踢出
                    // 说明这个是重复文件，系统里有这个文件
                    commit("UPDATE_FILE_LIST", {
                        i,
                        file: {
                            ...state.fileList[i],
                            status: tasksStatus.REMOVE,
                            msg: res.msg
                        }
                    })
                    Message.error({
                        message: `创建文件${state.fileList[i].rawFile.name}失败：${res.msg}`,
                    });
                }
            }

            commit('ADD_UPLOAD_LIST')

            // 真正的开始上传
            if (!state.uploading) {
                dispatch({
                    type: 'uploadFiles'
                })
            }

            return Promise.resolve()
        },
        // 上传文件循环
        async uploadFiles({ commit, dispatch, state}) {
            commit("SET_UPLOADING", true)
            // 命名 遍历 uploadList 上传文件的循环
            uploadListLoop: for (let i in state.uploadList) {
                // 跳过暂停的文件
                if (state.uploadList[i].status != tasksStatus.WAITING_UPLOAD) {
                    continue uploadListLoop;
                }

                // 开始上传，设置状态为上传中
                // 上传成功了就将这一个分块数据标记为已上传
                commit("UPDATE_UPLOAD_LIST", {
                    i,
                    file: {
                        ...state.uploadList[i],
                        status: tasksStatus.UPLOADING
                    }
                })
                
                // 命名 一个文件分块上传的循环
                // 遍历要上传的文件的分块列表，上传没有上传的
                chunksLoop: for (let j in state.uploadList[i].fileChunks) {
                    // 如果当前分块被标记为已上传了，就跳过
                    if (state.uploadList[i].fileChunks[j].uploaded) {
                        continue chunksLoop;
                    }

                    // 记录上传的时间，用于计算上传速度
                    // this.startUploadTime = new Date().getTime();

                    // 记录时间
                    let timeRecord = new Date().getTime();
                    // let uploadedRecord = 0;

                    // 命名 上传失败重试的循环
                    // reTryLoop:
                    // 如果文件上传发生错误了，有 10 次机会重新上传该分块的文件，如果 10 次都失败了，再报错
                    for (let re = 0; re < 10; re++) {
                        // 终止上传，在上传分块失败重复上传循环中
                        if (state.uploadList[i].status === tasksStatus.PAUSE) {
                            continue uploadListLoop;
                        }
                        
                        // 上传分块
                        let res = await uploadApi
                            .uploadFile(
                                // 文件服务器全路径
                                state.uploadList[i].serverFullFileName,
                                // 分块数据
                                state.uploadList[i].fileChunks[j].file,
                                // 总分块数
                                state.uploadList[i].fileChunks.length,
                                // 现在上传的是第几个分块
                                j,
                                // 进度控制
                                (progressEvent) => {
                                    /**
                                     * {
                                     *  total: 
                                     *  type: "progress"
                                     *  loaded: 
                                     * }
                                     * 
                                     */
                                    // 需要注意，这个只是写入 http request 的进度，并没有真正获取到 http response，所以这里应该永远不要直接到进度 100
                                    let progressWrite = parseInt(((j  * SIZE + progressEvent.loaded) / state.uploadList[i].rawFile.size) * 100)
                                    progressWrite = progressWrite > 1 ? progressWrite - 1: progressWrite
                                    // 这里的 progressEvent.loaded 不仅仅是上传的file的大小，所以会有些偏差导致progress > 100
                                    if (progressWrite >= 100) {
                                        progressWrite = 99
                                    }
                                    if (state.uploadList[i].progressPercent >= progressWrite) {
                                        // 发生什么错误触发了retry
                                        commit('SET_UPLOAD_SPEED', state.uploadSpeed / 2)
                                    } else {
                                        // 正常的上传
                                        commit("UPDATE_UPLOAD_LIST", {
                                            i,
                                            file: {
                                                ...state.uploadList[i],
                                                progressPercent: state.uploadList[i].progressPercent <= progressWrite ? progressWrite : state.uploadList[i].progressPercent
                                            }
                                        })
                                        // let takeTime = (new Date().getTime() - timeRecord) / 1000;
                                        // commit('SET_UPLOAD_SPEED', progressEvent.loaded / takeTime)
                                        
                                    }
                                    
                                }
                            )
                            .catch(err => {
                                console.log(err);
                            });

                        if (res) {
                            if (res.success) {
                                // 设置上传速度
                                let takeTime = (new Date().getTime() - timeRecord) / 1000;
                                commit('SET_UPLOAD_SPEED', state.uploadList[i].fileChunks[j].file.size / takeTime)
                                // 设置分块上传成功
                                commit("SET_UPLOADED_MARK", {
                                    i,
                                    j
                                })
                                // 计算进度条数据
                                commit('UPDATE_UPLOAD_LIST', {
                                    i,
                                    file: {
                                        ...state.uploadList[i],
                                        progressPercent: parseInt(
                                            (state.uploadList[i].fileChunks.filter(k => k.uploaded).length / state.uploadList[i].fileChunks.length) * 100
                                        )
                                    }
                                })
                                break;
                            } else {
                                // 如果返回的data里是空的，大概就是不能上传一模一样的文件
                                if (res.msg.length === 0) {
                                    res.msg = "系统存在完全相同文件，请勿重复上传。";
                                }
                                // 上传失败
                                commit("UPDATE_UPLOAD_LIST", {
                                    i,
                                    file: {
                                        ...state.uploadList[i],
                                        status: tasksStatus.PAUSE,
                                        msg: res.msg
                                    }
                                })
                                Message.error({
                                    message: `文件${ state.uploadList[i].rawFile.name }上传失败：${ res.msg }`,
                                });
                                // 开始下一个文件的上传
                                continue uploadListLoop;
                            }
                        }
                        // 能到这里的话说明分块上传超时或者什么失败了，将上传速度置0
                        commit('SET_UPLOAD_SPEED', 0)
                    }

                    // 终止上传的，在循环上传分块中
                    // 用户手动终止上传，移除任务
                    if (state.uploadList[i].status != tasksStatus.UPLOADING) {
                        continue uploadListLoop;
                    }

                    // 判断这个分块有没有上传成功，如果已经重试10次都失败了，就报错了
                    if (!state.uploadList[i].fileChunks[j].uploaded) {
                        // 上传失败
                        commit("UPDATE_UPLOAD_LIST", {
                            i,
                            file: {
                                ...state.uploadList[i],
                                status: tasksStatus.PAUSE,
                                msg: "连接超时"
                            }
                        })
                        Message.error({
                            message: `文件${ state.uploadList[i].rawFile.name}上传失败：连接超时。`,
                        });
                    }
                }

                // 终止上传了就不onSuccess了
                // 在循环上传uploadList中
                if (state.uploadList[i].status != tasksStatus.UPLOADING) {
                    continue uploadListLoop;
                }

                // 一个文件上传完之后就调用
                await dispatch({
                    type: 'onSuccess',
                    i
                });
            }
            commit('SET_UPLOADING', false)

            // 重新去检查是否有没上传完的任务（用户点击了重试）
            for(let i in state.uploadList) {
                // 没有pause，没有remove，没有completed的，就是要上传的
                if (
                    state.uploadList[i].status === tasksStatus.WAITING_UPLOAD
                ) {
                    dispatch({
                        type: 'uploadFiles'
                    })
                }
            }
        },
        /**
         * 上传完了之后的回调
         * @param {*} param0 
         * @param {*} payload 
         * {
         *  i: uploadList内的任务下标
         * } 
         */
        async onSuccess({ state, commit, rootState, dispatch }, payload) {
            let i = payload.i
            for (let j in state.uploadList[i].fileChunks) {
                if (!state.uploadList[i].fileChunks[j].uploaded) {
                    return;
                }
            }
            // 调用上传完的接口，afterUploadFile
            let res = await uploadApi.afterUploadFile(
                state.uploadList[i].keyword,
                state.uploadList[i].serverFullFileName
            )

            // 上传成功
            if (res.success) {
                if (res.data[0].state === 'uploadSuccess') {
                    // 改为上传完成状态
                    commit("UPDATE_UPLOAD_LIST", {
                        i,
                        file: {
                            ...state.uploadList[i],
                            status: tasksStatus.COMPLETED,
                            msg: '上传完成'
                        }
                    })
                    Message.success({
                        message: `文件${ state.uploadList[i].O_filename } 上传成功！`,
                    })
                    if (rootState.doc.ProjectKeyWord === state.uploadList[i].projectKeyword) {
                        // 确认上传成功之后刷新 docList
                        dispatch("doc/getDocList", {
                            ProjectKeyWord: state.uploadList[i].projectKeyword,
                            filterJson: "",
                            page: 1,
                            limit: 50
                        }, {
                            root: true
                        });
                    }
                    
                    // dispatch({
                    //     type: "doc/getDocList",
                    //     ProjectKeyWord: state.
                    // })
                } else {
                    // 改为上传完成状态
                    commit("UPDATE_UPLOAD_LIST", {
                        i,
                        file: {
                            ...state.uploadList[i],
                            status: tasksStatus.PAUSE,
                            msg: `${state.uploadList[i].O_filename}上传完回调失败：${res.msg}`
                        }
                    })
                    Message.warning({
                        message: `${ state.uploadList[i].O_filename }上传完回调失败：${res.msg}`
                    })
                }
            }
        },
        /* ---------------------------------------------------------- */
        /**
         * 暂停一个任务
         * @param {*} param0 
         * @param {*} payload 
         * {
         *  uid: 上传任务唯一标识
         * }
         */
        pauseTasks({ commit }, payload) {
            commit('PAUSE_TASKS', payload.uid)
        },
        /**
         * 重新开始一个任务
         * @param {*} param0 
         * @param {*} payload 
         * {
         *  uid: 上传任务唯一标识
         * }
         */
        restartTasks({ state, commit, dispatch }, payload) {
            commit('RESTART_TASKS', payload.uid)
            if(!state.uploading) {
                dispatch('uploadFiles')
            }
        }
    },
    getters: {
        fileList: state => state.fileList,
        uploadList: state => state.uploadList,
        uploadSpeed: state => state.uploadSpeed
    }

}