<!--

    付款通知单

-->

<template>
    <div id="paymentNotice">
        <el-dialog
            :visible.sync="showDialog"
            :before-close="closeDialog"
            title="付款通知单"
            width="90%"
            :close-on-click-modal="false"
        >
            <el-form :rules="rules" ref="paymentNoticeForm" :model="form" label-width="150px">
                <el-form-item label="申请日期" prop="draftDate">
                    <el-date-picker v-model="form.draftDate" type="date" placeholder="请选择申请日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="文档编号" prop="docNumber">
                    <el-input v-model="form.docNumber" placeholder="请输入文档编号"></el-input>
                </el-form-item>
                <el-form-item label="合同编号" prop="contractNo">
                    <el-input v-model="form.contractNo" placeholder="请输入合同编号"></el-input>
                </el-form-item>
                <el-form-item label="缓急程度" prop="urgency">
                    <el-radio v-model="form.urgency" label="紧急" border size='mini'>紧急</el-radio>
                    <el-radio v-model="form.urgency" label="普通" border size='mini'>普通</el-radio>
                </el-form-item>
                <el-form-item label="付款方式" prop="payway">
                    <el-radio v-model="form.payway" label="转账" border size='mini'>转账</el-radio>
                    <el-radio v-model="form.payway" label="现金" border size='mini'>现金</el-radio>
                </el-form-item>
                <el-form-item label="收款单位联系人" prop="contactName">
                    <el-input v-model="form.contactName" placeholder="请输入联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactPhone">
                    <el-input v-model.number="form.contactPhone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="款项类型" prop="paymentType">
                    <el-radio v-model="form.paymentType" label="其它支付" border size='mini'>其它支付</el-radio>
                    <el-radio v-model="form.paymentType" label="归还贷款" border size='mini'>归还贷款</el-radio>
                    <el-radio v-model="form.paymentType" label="归还利息" border size='mini'>归还利息</el-radio>
                    <el-radio v-model="form.paymentType" label="税金缴纳" border size='mini'>税金缴纳</el-radio>
                </el-form-item>
                <el-form-item label="收款单位" prop="collectionUnit">
                    <el-input v-model="form.collectionUnit" placeholder="请输入收款单位"></el-input>
                </el-form-item>
                <el-form-item label="开户银行" prop="bank">
                    <el-input v-model="form.bank" placeholder="请输入开户银行"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="form.account" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="用途" prop="useage">
                    <el-input v-model="form.useage" placeholder="请输入用途"></el-input>
                </el-form-item>
                <el-form-item label="合同金额" prop="contractAmount">
                    <el-input v-model="form.contractAmount" type="number" placeholder="请输入合同金额"></el-input>
                </el-form-item>
                <el-form-item label="已付金额" prop="amountPaid">
                    <el-input v-model="form.amountPaid" type="number" placeholder="请输入已付金额"></el-input>
                </el-form-item>
                <el-form-item label="合同付款条件说明" prop="description">
                    <el-input v-model="form.description" placeholder="请输入合同付款条件说明"></el-input>
                </el-form-item>
                <el-form-item label="本次付款金额（小写）" label-width="180px" prop="thisPaymentAmount">
                    <el-input v-model="form.thisPaymentAmount" type="number" placeholder="请输入本次付款金额"></el-input>
                </el-form-item>
                <el-form-item label="本次付款金额（大写）" label-width="180px" prop="thisPaymentAmountUpper">
                    <el-input v-model="form.thisPaymentAmountUpper" placeholder="请输入本次付款金额"></el-input>
                </el-form-item>
                <select-attachment
                    ref='selectAttachment'
                    :selected.sync='form.attachmentList'
                />
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog" :disabled="submitLoading">取 消</el-button>
                <el-button type="primary" size="small" @click="submit" :disabled="submitLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import selectAttachment from './common/selectAttachment.vue'
import processApi from './api/process'
import { ConvertMoneyToChineseCapital } from '@/util/Common'
import { isTelephoneValid } from '@/util/Regular'


export default {
    props: {
        showDialog: {
            type: Boolean,
            required: true,
            default: function() {
                return false;
            }
        },
        projectKeyword: {
            type: String,
            required: true,
        }
    },
    components: {
        selectAttachment,
    },
    data() {
        return {
            // 提交loading
            submitLoading: false, 
            form: {
                // 申请日期
                draftDate: null,
                // 文档编号
                docName: '',
                // 合同编号
                contractNo: "",
                // 缓急程度
                urgency: '',
                // 付款方式
                payway: '',
                // 收款单位联系人
                contactName: '',
                // 联系电话
                contactPhone: '',
                // 款项类型
                paymentType: '',
                // 收款单位
                collectionUnit: '',
                // 开户银行
                bank: '',
                // 账号
                account: '',
                // 用途
                useage: '',
                // 合同金额
                contractAmount: '',
                // 已付金额
                amountPaid: '',
                // 合同付款条件说明
                description: '',
                // 本次付款金额 小写
                thisPaymentAmount: null,
                // 本次付款金额 大学
                thisPaymentAmountUpper: '',
                // 附件
                attachmentList: [],

            },
            rules: {
                draftDate: [
                    {
                        required: true,
                        message: '请选择申请日期',
                        trigger: 'blur'
                    }
                ],
                docNumber: [
                    {
                        required: true,
                        message: '请输入文档编号',
                        trigger: 'blur'
                    }
                ],
                contractNo: [
                    {
                        required: true,
                        message: "请填写合同编号",
                        trigger: "blur"
                    }
                ],
                urgency: [
                    {
                        required: true,
                        message: "请选择缓急程度",
                        trigger: "blur"
                    }
                ],
                payway: [
                    {
                        required: true,
                        message: "请选择付款方式",
                        trigger: "blur"
                    }
                ],
                contactName: [
                    {
                        required: true,
                        message: "请输入收款单位联系人",
                        trigger: "blur"
                    },
                ],
                contactPhone: [
                    {
                        validator: this.phoneValidate,
                        message: '手机号格式不正确',
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        message: "请输入联系电话",
                        trigger: "blur"
                    },
                ],
                paymentType: [
                    {
                        required: true,
                        message: "请选择款项类型",
                        trigger: "blur"
                    }
                ],
                collectionUnit: [
                    {
                        required: true,
                        message: "请输入收款单位",
                        trigger: "blur"
                    }
                ],
                bank: [
                    {
                        required: true,
                        message: "请输入开户银行",
                        trigger: "blur"
                    }
                ],
                account: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: "blur"
                    }
                ],
                useage: [
                    {
                        required: true,
                        message: "请输入用途",
                        trigger: "blur"
                    }
                ],
                contractAmount: [
                    {
                        required: true,
                        message: "请输入合同金额",
                        trigger: "blur"
                    }
                ],
                amountPaid: [
                    {
                        required: true,
                        message: "已付金额",
                        trigger: "blur"
                    }
                ],
                description: [
                    {
                        required: true,
                        message: "请输入合同付款条件描述",
                        trigger: "blur"
                    }
                ],
                thisPaymentAmount: [
                    {
                        required: true,
                        message: "请输入本次付款金额（小写）",
                        trigger: "blur"
                    }
                ],
                thisPaymentAmountUpper: [
                    {
                        required: true,
                        message: '请输入本次付款金额（大写）'
                    }
                ]
            }
        };
    },
    computed: {
        thisPaymentAmount() {
            return this.form.thisPaymentAmount
        }
    },
    watch: {
        thisPaymentAmount(v) {
            if (v) {
                this.form.thisPaymentAmountUpper = ConvertMoneyToChineseCapital(v)
            } else {
                this.form.thisPaymentAmountUpper = ''
            }
        }
    },
    methods: {
        closeDialog(mode) {
            this.$emit("closeDialog", mode);
        },
        // 手机号验证
        phoneValidate(rule, value, callback) {
            if(isTelephoneValid(value)) {
                callback()
            } else {
                callback('手机号格式不正确')
            }
        },
        // 重置表单
        resetForm() {
            this.$refs['paymentNoticeForm'].resetFields()
            this.$refs.selectAttachment.cancel('refresh')
        },
        submit() {
            this.$refs["paymentNoticeForm"].validate(async valid => {
                if (valid) {
                    this.submitLoading = true
                    let payload = {
                        ...this.form,
                        docList: this.form.attachmentList.map(i => i.keyword).join(','),
                        projectKeyword: this.projectKeyword,
                    }

                    let res = await processApi.NewPaymentNotice(payload).catch(err => {
                        this.$message({
                            message: `提交表单失败：${ err }`
                        })
                        return 
                    })

                    this.submitLoading = false

                    if (!res.success) {
                        this.$message({
                            message: `提交表单失败：${ res.msg }`,
                            type: 'error'
                        })
                        return 
                    } else {
                        this.$message({
                            message: '创建付款通知单成功！',
                            type: 'success'
                        })
                        this.closeDialog('refresh')
                        this.resetForm()
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss">
#paymentNotice {
    .el-dialog {
        max-width: 700px;
    }
    .el-select {
        width: 100%;
        max-width: 450px;
    }
    .el-cascader {
        width: 100%;
        max-width: 450px;
    }
    .el-input {
        width: 100%;
        max-width: 450px;
    }
}
</style>

