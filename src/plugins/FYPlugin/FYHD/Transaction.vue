<!-- 通用事务审批流程 -->

<template>
    <div id="transaction">
        <el-dialog
            :visible.sync="showDialog"
            :before-close="closeDialog"
            title="通用事务审批流程"
            width="90%"
            :close-on-click-modal="false"
        >
            <el-form :rules="rules" ref='transactionForm' :model="form" label-width='150px'>
                <!-- <el-form-item label='单号' prop='number'>
                    <el-input v-model="form.number" placeholder="请填写单号"></el-input>
                </el-form-item> -->
                <doc-number :number.sync='form.number'></doc-number>
                <el-form-item label='标题' prop='title'>
                    <el-input v-model="form.title" placeholder="请填写标题"></el-input>
                </el-form-item>
                <el-form-item label='内容' prop='content'>
                    <el-input type='textarea' v-model="form.content" :autosize="{ minRows: 3}" placeholder="请填写内容"></el-input>
                </el-form-item>

                <el-form-item label='会审部门' prop="transaction">
                    <triage-department :selected.sync='form.transaction' />
                </el-form-item>
                <el-form-item label='总工审批' prop="notifyChief">
                    <el-radio v-model="form.notifyChief" :label="true" border size='mini'>是</el-radio>
                    <el-radio v-model="form.notifyChief" :label="false" border size='mini'>否</el-radio>
                </el-form-item>
                <el-form-item label='款项是否超过200万' prop="over200">
                    <el-radio v-model="form.over200" :label="true" border size='mini'>是</el-radio>
                    <el-radio v-model="form.over200" :label="false" border size='mini'>否</el-radio>
                </el-form-item>
                <div style="margin-left: 150px; max-width: 450px">
                    <select-attachment ref='selectAttachment' :selected.sync='selected'/>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog">取 消</el-button>
                <el-button type="primary" size="small" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import triageDepartment from './common/triageDepartment.vue'
import docNumber from './common/docNumber.vue'
import selectAttachment from './common/selectAttachment.vue'
import processApi from './api/process'


export default {
    components: {
        triageDepartment,
        docNumber,
        selectAttachment,
    },
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
            required: true
        },
        docKeyword: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            // 选择关联的附件
            selected: [],
            form: {
                // 标题
                title: '',
                // 内容
                content: '',
                // 单号
                number: '',
                // 会审部门
                changeType: '',
                // 总工审批
                notifyChief: false,
                // 款项是否超过200w
                over200: false,
                // 会审部门
                transaction: []
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: '请填写标题',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '请填写内容',
                        trigger: 'blur'
                    }
                ],
                number: [
                    {
                        required: true,
                        message: '请填写单号',
                        trigger: 'blur'
                    }
                ],
                transaction: [
                    {
                        required: true,
                        message: '请选择会审部门',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (value.length < 1) {
                                callback(new Error("请至少选择一个会审部门"))
                            } else {
                                callback()
                            }
                        }
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
            this.$refs['transactionForm'].validate(async (valid) => {
                if(valid) {
                    let docList = [this.docKeyword]
                    this.selected.forEach(i => {
                        if (i.keyword != this.docKeyword) {
                            docList.push(i.keyword)
                        }
                    })
                    let payload = {
                        // 单号
                        number: this.form.number,
                        // 总工审批
                        chiefAppro: this.form.notifyChief ? '是' : '否',
                        // 款项超过200w
                        over200: this.form.over200 ? '是' : '否',
                        // 标题
                        title: this.form.title,
                        // 内容
                        content: this.form.content,
                        // 会审部门
                        department: this.form.transaction.join(','),
                        // 文件夹
                        projectKeyword: this.projectKeyword,
                        // 选中的文档
                        docList: docList.join(',')
                    }

                    let res = await processApi.NewTransaction(payload).catch(err => {
                        this.$message({
                            message: `提交流程失败：${ err }`
                        })
                    })

                    if (res.success) {
                        this.$message({
                            message: '提交流程成功！',
                            type: 'success'
                        })
                        this.resetForm()
                        this.closeDialog('refresh')
                    } else {
                        this.$message({
                            message: `提交表单错误：${ res.msg }`,
                            duration: 10000,
                            type: 'error'
                        })
                    }
                }
            })
        },
        // 重置表单
        resetForm() {
            this.$refs['transactionForm'].resetFields()
            this.$refs.selectAttachment.cancel()
        }
    },
    watch: {

    }
};
</script>

<style lang="scss">
#transaction {
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
    .el-input, .el-textarea {
        width: 100%;
        max-width: 450px;
    }
}
</style>

