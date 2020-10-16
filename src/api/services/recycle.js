import request from '../BaseAxios'
import Qs from 'qs'
import store from '@/store'


export default {
    // 获取回收站数据
    /*
        page: 页码 默认1
        limit： 每页数量 默认10
        timeSelect： 选择时间(0.全部，1.一天之内，2.一周之内，3.一月之内，4.一年内，5.选择时间)
        fileType： 类型(0.全部，1.目录，2.文档，3.流程)
        fileDeleter： 删除者(0.全部，1.选择人员)
        startDate： 开始时间
        endDate: 结束时间
    */
    getRecycleList(page, limit, timeSelect, fileType, fileDeleter, startDate, endDate,delUseKeyWord) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.WebApi.CollectionDepotController',
            // C: 'CDMSWebApi.CollectionDepotController',
            A: 'GetRecycleList',
            sid,
            page,
            limit,
            timeSelect,
            fileType,
            fileDeleter,
            startDate,
            endDate,
            delUseKeyWord
        })
        return request({
            url: `WebApi/Post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    },
    // 清空回收站
    // type 文件类型：0.全部，1.目录，2.文档，3.流程
    // Empty ture 是，false 否
    emptyTrash(Type, Empty) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.WebApi.CollectionDepotController',
            A: 'EmptyTrash',
            sid,
            Type,
            Empty
        })
        return request({
            url: `WebApi/Post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    },
    //删除回收站文件
    deleteFile(keyWordList) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.WebApi.CollectionDepotController',
            A: 'DeleteFile',
            sid,
            keyWordList
        })
        return request({
            url: `WebApi/Post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    },
    // 还原回收站文件
    onRecycle(keyWordList) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.WebApi.CollectionDepotController',
            A: 'OnRecycle',
            sid,
            keyWordList,
        })
        return request({
            url: `WebApi/Post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    },
}
