import request from '@/api/BaseAxios'
import Qs from 'qs'
import store from '@/store'

export default {
    // 创建任务
    createTask(ProjectKeyWord, docAttrJson) {
        const sid = store.getters.sid
        // const data = 
        return request({
            url: `WebApi/post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: Qs.stringify({
                C: 'AVEVA.CDMS.HXPC_Plugins.WorkTask',
                A: 'CreateTask',
                sid,
                ProjectKeyWord,
                docAttrJson: JSON.stringify(docAttrJson)
            })
        })
    },
    // 创建任务报告
    createTaskReport(TaskKeyword, reportAttrJson) {
        const sid = store.getters.sid
        return request({
            url: `WebApi/post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: Qs.stringify({
                C: 'AVEVA.CDMS.HXPC_Plugins.WorkTask',
                A: 'CreateTaskReport',
                sid,
                TaskKeyword,
                reportAttrJson: JSON.stringify(reportAttrJson)
            })
        })
    },
    // 创建用户工作任务（在工日填报，即任务报告表单创建） 
    createUserTask(UserKeyword, docAttrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.WorkTask',
            A: 'CreateUserTask',
            sid,
            UserKeyword,
            docAttrJson: JSON.stringify(docAttrJson)
        })
        return request({
            url: `WebApi/post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    },
    // 删除任务报告
    deleteTaskReport(ReportKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.WorkTask',
            A: 'DeleteTaskReport',
            sid,
            ReportKeyword,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 获取任务报告内容
    getTaskReport(ReportKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.WorkTask',
            A: 'GetTaskReport',
            sid,
            ReportKeyword,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 获取任务报告表单默认参数 
    getTaskReportDefault() {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.WorkTask',
            A: 'GetTaskReportDefault',
            sid,
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 获取任务的报告列表 
    getTaskReportList(TaskKeyword) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.WorkTask',
            A: 'GetTaskReportList',
            sid,
            TaskKeyword
        })
        return request({
            url: `WebApi/post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    // 修改任务报告 
    modiTaskReport(ReportKeyword, reportAttrJson) {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.HXPC_Plugins.WorkTask',
            A: 'ModiTaskReport',
            sid,
            ReportKeyword,
            reportAttrJson: JSON.stringify(reportAttrJson)
        })
        return request({
            url: `WebApi/post`,
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
    },
}