import request from '@/api/BaseAxios'
import Qs from 'qs'
import store from '@/store'

import { timeFormat } from "@/util/Common"


export default {
    // 获取部门列表
    GetDepartmentList() {
        const sid = store.getters.sid
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.FYGroup',
            A: 'GetDepartmentList',
            sid,
        })
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },




    // 通用事务审批，新建事务流程
    /**
     * 
     * projectKeyword 文件夹keyword
     * docList 第一个为选中的dockeyword， 剩下的接选择的附件
     * 
     * number 单号
     * chiefAppro [是 / 否] 总工审批
     * over200 [是 / 否] 款项过200
     * title 标题
     * content 内容
     * department 会审部门 传code 用 , 分割
     * 
     *  
     */
    NewTransaction(payload) {
        const sid = store.getters.sid

        let attrJson = [
            {
                // 单号
                "FD_DOCNUMBER": payload.number,
            },
            {
                // 总工审批 
                "FD_CHIEFAPPRO": payload.chiefAppro,
            },
            {
                // 款项超过200万
                "FD_EXCEEDS2M": payload.over200,
            },
            {
                // 标题
                "FD_TITLE": payload.title
            },
            {
                // 内容
                "FD_CONTENT": payload.content
            },
            {
                // 会审部门
                "FD_JOINTDEPARTMENT": payload.department
            }
        ]

        attrJson = JSON.stringify(attrJson)

        // 格式化 attrJson
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Transaction',
            A: 'NewTransaction',
            sid,
            projectKeyword: payload.projectKeyword,
            docList: payload.docList,
            attrJson,
        })

        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    /**
     * 
     * 创建设计变更单
     * 
     * number 单号
     * projectName 项目名称
     * reportingDepartment 呈报部门
     * designChangeName 设计变更名称
     * proposerDate   * 直接传 elementui datepicker 里返回的 Date 类型参数就行
     * totalPrice 变更增减总金额
     * over200 款项超过200w
     * raiseState 提出阶段
     * contractName 合同名称
     * contractNo 合同编号
     * designUnit 设计单位
     * 
     * 
     * 
     * 
     * 
     */
    NewDesignChange(payload) {
        const sid = store.getters.sid

        let attrJson = [
            {
                // 文档编号
                'FD_DOCNUMBER': payload.number,
            },
            {
                // 项目名称
                'FD_PROJECTNAME': payload.projectName,
            }, {
                // 呈报部门
                'FD_DEPARTMENT': payload.reportingDepartment,
            }, {
                // 设计变更名称
                'FD_DESIGNCHANGENAME': payload.designChangeName,
            }, {
                // 拟文日期
                'FD_DRAFTDATE': timeFormat(payload.proposerDate),
            }, {
                // 变更增/减总金额
                'FD_CHANGEAMOUNT': payload.totalPrice,
            },
            // {
            //     // 款项超过20万
            //     'FD_EXCEEDS20W': payload.over20,
            // }, 
            {
                // 提出阶段
                'FD_PROPOSESTAGE': payload.raiseStage,
            }, {
                // 合同名称
                'FD_TITLE': payload.contractName,
            }, {
                // 合同编号
                'FD_CONTRACTNO': payload.contractNo,
            }, {
                // 设计单位
                'FD_DESIGNUNIT': payload.designUnit,
            }, {
                // 提出方
                'FD_PROPOSER': payload.proposer,
            }, {
                // 具体原因大类
                'FD_SPECIFICREASONI': payload.specificReason1,
            }, {
                // 具体原因小类
                'FD_SPECIFICREASONII': payload.specificReason2,
            }, {
                // 变更类型 1
                'FD_TYPEOFCHANGE': payload.changeType1,
            },
            {
                // 变更类型 2
                'FD_TYPEOFCHANGEII': payload.changeType2,
            },
            {
                // 变更部位现状及修改内容
                "FD_CONTENT": payload.content,
            },
            {
                // 变更知会专业
                "FD_INFORMPROFESSIONAL": payload.major,
            },
            // {
            //     // 是否涉及销售承诺及买卖合同条款
            //     'FD_INVOSALESCONTRACT': payload.invoSalesContract
            // }
        ]
    
        attrJson = JSON.stringify(attrJson)


        // 格式化 attrJson
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Document',
            A: 'NewDesignChange',
            sid,
            projectKeyword: payload.projectKeyword,
            docList: payload.docList,
            attrJson,
        })
        
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    

    /**
     * 
     * 创建付款通知单
     * 
     * projectKeyword
     * docList
     * 
     */
    NewPaymentNotice(payload) {
        const sid = store.getters.sid


        let attrJson = [
            {
                // 申请日期
                'FD_DRAFTDATE': timeFormat(payload.draftDate),
            },
            {
                // 文档编号
                'FD_DOCNUMBER': payload.docNumber
            },
            {
                // 合同编号
                'FD_CONTRACTNO': payload.contractNo,
            },
            {
                // 缓急程度
                'FD_URGENCY': payload.urgency,
            },
            {
                // 付款方式
                'FD_PAYMENTMETHOD': payload.payway,
            },
            {
                // 收款单位联系人
                'FD_CONTACTPERSON': payload.contactName,
            },
            {
                // 联系电话
                'FD_PHONE': payload.contactPhone,
            },
            {
                // 款项类型
                'FD_PAYMENTTYPE': payload.paymentType,
            },
            {
                /// 收款单位
                'FD_RECEIVINGUNIT': payload.collectionUnit,
            },
            {
                // 开户银行
                'FD_DEPOSITBANK': payload.bank,
            },
            {
                // 账号
                'FD_BANKACCOUNT': payload.account,
            },
            {
                // 付款用途
                'FD_PAYMENTPURPOSE': payload.useage,
            },
            {
                // 合同金额
                'FD_CONTRACTAMOUNT': payload.contractAmount,
            },
            {
                // 已付金额
                'FD_AMOUNTPAID': payload.amountPaid,
            },
            {
                // 付款条件说明
                'FD_PAYMENTTERMS': payload.description,
            },
            {
                // 本次付款金额小写
                'FD_PAYAMOUNTLOW': payload.thisPaymentAmount,
            },
            {
                // 本次付款金额大写
                'FD_PAYAMOUNTUPPER': payload.thisPaymentAmountUpper,
            },
        ]

        attrJson = JSON.stringify(attrJson)

        // 格式化 attrJson
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Document',
            A: 'NewPaymentNotice',
            sid,
            projectKeyword: payload.projectKeyword,
            docList: payload.docList,
            attrJson,
        })

        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },
    /**
     * 
     * 创建 鹤洞业务审批
     * 
     * 
     */
    NewBusiness(payload) {
        let attrJson = [
            {
                // 填表日期
                'FD_DRAFTDATE': timeFormat(payload.draftDate),
            },
            {
                // 文档编号
                'FD_DOCNUMBER': payload.docNumber
            },
            {
                // 呈批事项
                'FD_TITLE': payload.submissions,
            },
            {
                // 密级
                'FD_SECRETLEVEL': payload.secretLevel,
            },
            {
                // 用印名称
                'FD_PRINTEDNAME': payload.printName,
            },
            {
                // 有无附件
                'FD_WITHATTACHMENTS': payload.hasAttachment,
            },
            {
                // 内容摘要
                'FD_CONTENT': payload.summary,
            },
            {
                // 业务关联方
                'FD_BUSINESSRELATED': payload.relational,
            },
            {
                // 涉及金额
                'FD_AMOUNTINVOLVED': payload.amountinvolved,
            },
            {
                // 时间期限
                'FD_TIMELIMIT': timeFormat(payload.deadline),
            },
            {
                // 复核人
                'FD_REVIEWUSER': payload.reviewUser,
            },
            {
                // 会审部门
                'FD_JOINTDEPARTMENT': payload.department,
            },
        ]

        

        attrJson = JSON.stringify(attrJson)
        const sid = store.getters.sid

        // 格式化 attrJson
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Document',
            A: 'NewBusiness',
            sid,
            projectKeyword: payload.projectKeyword,
            docList: payload.docList,
            attrJson,
        })

        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    /**
     * 
     * 创建印章使用审批
     * 
     * 
     */
    NewSealUser(payload) {
        let attrJson = [
            {
                // 申请日期
                "FD_DRAFTDATE": timeFormat(payload.draftDate),
            },
            {
                // 文档编号
                'FD_DOCNUMBER': payload.docNumber
            },
            {
                // 事由
                "FD_TITLE": payload.reason,
            },
            {
                // 印章类别
                "FD_SEALCATEGORY": payload.sealCategory,
            },
            {
                // 使用类别
                "FD_USECATEGORY": payload.typeOfUse1,
            },
            {
                // 证照类别
                "FD_LICENSETYPE": payload.licenseCategory,
            },
            {
                // 证照使用类别
                "FD_LICENSEUSETYPE": payload.typeOfUse2,
            },
            {
                // 份数
                "FD_COPIES": payload.number,
            },
        ]

        console.log(attrJson)

        attrJson = JSON.stringify(attrJson)
        const sid = store.getters.sid

        // 格式化 attrJson
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Document',
            A: 'NewSealUse',
            sid,
            projectKeyword: payload.projectKeyword,
            docList: payload.docList,
            attrJson,
        })
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    /**
     * 
     * 
     * 创建发文审批
     * 
     * 
     */
    NewSendDocument(payload) {
        let attrJson = [
            {
                // 填表日期
                'FD_DRAFTDATE': timeFormat(payload.draftDate),
            },
            {
                // 发文类型
                'FD_POSTTYPE': payload.issueType,
            },
            {
                // 文件名称
                'FD_FILENAME': payload.fileName,
            },
            {
                // 文件编号
                'FD_DOCNUMBER': payload.fileNo,
            },
            {
                // 发文对象
                'FD_POSTOBJECT': payload.issueTarget,
            },
            {
                // 用印名称
                'FD_PRINTEDNAME': payload.printName,
            },
            {
                // 密级
                'FD_SECRETLEVEL': payload.secretLevel,
            },
            {
                // 有无附件
                'FD_WITHATTACHMENTS': payload.hasAttachment,
            },
            {
                // 主送人
                'FD_MAINSEND': payload.mainReceiver,
            },
            {
                // 抄送人
                'FD_CC': payload.secondReceiver,
            },
            {
                // 主题词
                'FD_TITLE': payload.subjectHeadings,
            },
            {
                // 内容摘要
                'FD_CONTENT': payload.contentSummary,
            },
            {
                // 拟发布时间
                'FD_RELEASEDATE': timeFormat(payload.releaseDate),
            },
            {
                // 会审部门
                'FD_JOINTDEPARTMENT': payload.department,
            },
        ]

        attrJson = JSON.stringify(attrJson)
        const sid = store.getters.sid

        // 格式化 attrJson
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Document',
            A: 'NewSendDocument',
            sid,
            projectKeyword: payload.projectKeyword,
            docList: payload.docList,
            attrJson,
        })
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    /**
     * 
     * 创建合同审批
     * 
     * 
     * 
     *  */
    NewContractApproval(payload) {
        let attrJson = [
            {
                // 填表日期
                'FD_DRAFTDATE': timeFormat(payload.draftDate),
            },
            {
                // 合同名称 
                'FD_TITLE': payload.contractName,
            },
            {
                // 合同编号
                'FD_CONTRACTNO': payload.contractNo,
            },
            {
                // 内容
                'FD_CONTENT': payload.contractContent,
            },
            {
                // 合同金额
                'FD_CONTRACTAMOUNT': payload.contractPrice,
            },
            {
                // 合同期
                'FD_CONTRACTPERIOD': payload.contractDate,
            },
            {
                // 款项是否超过200万
                "FD_EXCEEDS2M": payload.over200
            }
        ]


        attrJson = JSON.stringify(attrJson)
        const sid = store.getters.sid

        // 格式化 attrJson
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Document',
            A: 'NewContractApproval',
            sid,
            projectKeyword: payload.projectKeyword,
            docList: payload.docList,
            attrJson,
        })
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    /**
     * 
     * 创建报销审批单
     * 
     * 
     * 
     * 
     */
    NewReimbursement(payload) {
        let attrJson = [
            {
                // 申请日期
                'FD_DRAFTDATE': payload.draftDate
            },
            {
                // 文档编号
                'FD_DOCNUMBER': payload.docNumber
            },
            {
                // 合计金额小写
                'FD_AMOUNTLOW': payload.totalPriceLow,
            },
            {
                // 合计金额大写
                'FD_AMOUNTUPPER': payload.totalPriceUpper
            },
            {
                // 未能取得票据原因
                'FD_FAILBILLREASONS': payload.reasonForNoDoc
            },
            {
                // 单据份数
                'FD_BILLSNUMBER': payload.docNum
            },
        ]
        
        let gridJson = []

        payload.reimbursementList.forEach(i => {
            gridJson.push({
                // 支付事由或品名
                "name": i.reason,
                // 数量
                'quantity': i.number,
                // 单位
                'unit': i.unit,
                // 单价
                'price': i.price,
                // 金额
                'amount': i.total
            })
        })

        attrJson = JSON.stringify(attrJson)
        gridJson = JSON.stringify(gridJson)
        
        const sid = store.getters.sid

        // 格式化 attrJson
        const data = Qs.stringify({
            C: 'AVEVA.CDMS.FY_Plugins.Document',
            A: 'NewReimbursement',
            sid,
            projectKeyword: payload.projectKeyword,
            docList: payload.docList,
            attrJson,
            gridJson
        })
        return request({
            url: `WebApi/Post/?${data}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}


