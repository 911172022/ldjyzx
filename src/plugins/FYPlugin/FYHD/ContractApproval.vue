<!--
    合同审批表
-->

<template>
    <div id="contractApproval">
        <el-dialog
            :visible.sync="showDialog"
            :before-close="closeDialog"
            title="合同审批表"
            width="90%"
            :close-on-click-modal="false"
        >
            <el-form :rules="rules" ref='contractApprovalForm' :model="form" label-width='90px'>
                <el-form-item label='填表日期' prop="draftDate">
                    <el-date-picker
                        v-model="form.draftDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label='合同名称' prop="contractName">
                    <el-input v-model="form.contractName" autosize placeholder="请输入合同名称"></el-input>
                </el-form-item>
                <el-form-item label='合同编号' prop="contractNo">
                    <el-input v-model="form.contractNo" autosize placeholder="请输入合同编号"></el-input>
                </el-form-item>
                <el-form-item label='内容' prop="contractContent">
                    <el-input v-model="form.contractContent" type='textarea' :autosize="{ minRows: 3}" placeholder="请输入合同内容"></el-input>
                </el-form-item>
                <!-- <div class="abwrapper">
                    <el-form-item label='甲方' prop="aSide">
                        <el-input v-model="form.aSide" autosize placeholder="请输入甲方"></el-input>
                    </el-form-item>
                    <el-form-item label='乙方' prop="bSide">
                        <el-input v-model="form.bSide" autosize placeholder="请输入乙方"></el-input>
                    </el-form-item>
                </div> -->
                <el-form-item label='合同金额' prop="contractPrice">
                    <el-input type="number" v-model.number="form.contractPrice" placeholder="请输入合同金额"></el-input>
                </el-form-item>
                <el-form-item label='合同期' prop="contractDate">
                    <!-- <el-date-picker
                        v-model="form.contractDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker> -->
                    <el-input v-model="form.contractDate"></el-input>
                </el-form-item>
                <el-form-item label='款项是否超过200万' prop="over200" label-width="160">
                    <el-radio v-model="form.over200" label="是" border size='mini'>是</el-radio>
                    <el-radio v-model="form.over200" label="否" border size='mini'>否</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog">取 消</el-button>
                <el-button type="primary" size="small" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import processApi from './api/process'



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
    data() {
        return {
            form: {
                // 填表日期
                draftDate: null,
                // 合同名称
                contractName: '',
                // 合同编号
                contractNo: '',
                // 内容
                contractContent: '',
                // 甲方乙方暂时隐藏
                // // 甲方
                // aSide: '',
                // // 乙方
                // bSide: '',
                // 合同金额
                contractPrice: null,
                // 合同期
                contractDate: null,
                over200: "否",
            },
            rules: {
                draftDate: [
                    {
                        required: true,
                        message: "请选择填表日期",
                        trigger: "blur"
                    }
                ],
                // 合同名称
                contractName: [
                    {
                        required: true,
                        message: '请输入合同名称',
                        trigger: 'blur'
                    }
                ],
                contractNo: [
                    {
                        required: true,
                        message: '请输入合同编号',
                        trigger: 'blur'
                    }
                ],
                contractContent: [
                    {
                        required: true,
                        message: '请输入合同内容',
                        trigger: 'blur'
                    }
                ],
                aSide: [
                    {
                        required: true,
                        message: '请输入甲方',
                        trigger: 'blur'
                    }
                ],
                bSide: [
                    {
                        required: true,
                        message: '请输入乙方',
                        trigger: 'blur'
                    }
                ],
                contractPrice: [
                    {
                        required: true,
                        message: '请输入合同金额',
                        trigger: 'blur'
                    }
                ],
                contractDate: [
                    {
                        required: true,
                        message: '请选择合同期',
                        trigger: 'blur'
                    }
                ],
                over200: [
                    {
                        required: true,
                        message: '请选择款项是否超过200万',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        closeDialog(mode) {
            this.$emit("closeDialog", mode);
        },
        submit() {
            this.$refs['contractApprovalForm'].validate(async (valid) => {
                if(valid) {
                    let payload = {
                        ...this.form,
                        projectKeyword: this.projectKeyword
                    }

                    let res = await processApi.NewContractApproval(payload).catch(err => {
                        this.$message({
                            message: `创建合同审批表失败：${ err }`,
                            type: 'error'
                        })
                    })

                    if (res.success) {
                        this.$message({
                            message: '创建合同审批表成功',
                            type: 'success'
                        })
                        this.resetForm()
                        this.closeDialog('refresh')
                    } else {
                        this.$message({
                            message: `创建合同审批表失败：${ res.msg }`,
                            type: 'error'
                        })
                    }
                }
            })
        },
        // 重置表单
        resetForm() {
            this.$refs['contractApprovalForm'].resetFields()
        }
    }
};
</script>

<style lang="scss">
#contractApproval {
    .el-dialog {
        max-width: 600px;
    }
    .el-select {
        width: 100%;
        max-width: 450px;
    }
    .el-cascader {
        width: 100%;
        max-width: 450px;
    }
    .el-input, .el-textarea {
        width: 100%;
        max-width: 450px;
    }
}
</style>

