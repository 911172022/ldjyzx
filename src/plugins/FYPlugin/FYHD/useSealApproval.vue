<!-- 印章使用审批表 -->

<template>
    <div id="useSealApproval">
        <el-dialog
            :visible.sync="showDialog"
            :before-close="closeDialog"
            title="印章使用审批"
            width="90%"
            :close-on-click-modal="false"
        >
            <el-form :rules="rules" ref='useSealApprovalForm' :model="form" label-width='160px'>

                <el-form-item label='申请日期' prop="draftDate">
                    <el-date-picker
                        v-model="form.draftDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label='合同编号' prop="docNumber">
                    <el-input v-model="form.docNumber" autosize placeholder="请输入合同编号"></el-input>
                </el-form-item>
                <el-form-item label='事由' prop="reason">
                    <el-input v-model="form.reason" autosize placeholder="请输入事由"></el-input>
                </el-form-item>
                <el-form-item label='印章类别' prop='sealCategory'>
                    <el-select v-model="form.sealCategory" size='medium' placeholder="请选择">
                        <el-option
                            v-for="item in sealCategoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='印章类别-其它' v-if="form.sealCategory === '其它'" prop="sealCategoryInput">
                    <el-input v-model="form.sealCategoryInput" autosize placeholder="请输入印章类别"></el-input>
                </el-form-item>
                <el-form-item label='使用类型' prop='typeOfUse1'>
                    <el-radio v-model="form.typeOfUse1" label="使用" border size='mini'>使用</el-radio>
                    <el-radio v-model="form.typeOfUse1" label="借用" border size='mini'>借用</el-radio>
                </el-form-item>
                <el-form-item label='证照类别' prop='licenseCategory'>
                    <el-select v-model="form.licenseCategory" size='medium' placeholder="请选择">
                        <el-option
                            v-for="item in licenseCategoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='证照类别-其它' v-if="form.licenseCategory === '其它'" prop="licenseCategoryInput">
                    <el-input v-model="form.licenseCategoryInput" autosize placeholder="请输入证照类别"></el-input>
                </el-form-item>
                <el-form-item label='使用类型' prop='typeOfUse2'>
                    <el-radio v-model="form.typeOfUse2" label="原件" border size='mini'>原件</el-radio>
                    <el-radio v-model="form.typeOfUse2" label="复印件" border size='mini'>复印件</el-radio>
                </el-form-item>
                <el-form-item label='份数' prop="number">
                    <el-input type='number' v-model="form.number" autosize placeholder="请输入份数"></el-input>
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
            required: true
        }
    },
    data() {
        return {
            // 印章类别
            sealCategoryOptions: [
                {
                    value: "公司印章",
                    label: "公司印章"
                },
                {
                    value: "公司财务章",
                    label: "公司财务章"
                },
                {
                    value: "公司合同章",
                    label: "公司合同章"
                },
                {
                    value: "法人代表章",
                    label: "法人代表章"
                },
                {
                    value: "其它",
                    label: "其它"
                },
            ],
            // 证照类别
            licenseCategoryOptions: [{
                    value: "营业执照正本",
                    label: "营业执照正本"
                },
                {
                    value: "营业执照副本",
                    label: "营业执照副本"
                },
                {
                    value: "银行信用证",
                    label: "银行信用证"
                },
                {
                    value: "银行开户许可证明",
                    label: "银行开户许可证明"
                },
                {
                    value: "其它",
                    label: "其它"
                },],
            form: {
                // 合同编号
                docNumber: '',
                // 申请日期
                draftDate: null,
                // 事由
                reason: '',
                // 印章类别
                sealCategory: '',
                // 印章类别为其它时用户填写的
                sealCategoryInput: '',
                // 使用类型1
                typeOfUse1: '',
                // 证照类别
                licenseCategory: '',
                // 证照类别用户输入
                licenseCategoryInput: '',
                // 使用类型2
                typeOfUse2: '',
                // 份数
                number: null,
            },
            rules: {
                docNumber: [
                    {
                        required: true,
                        message: '请填写合同编号',
                        trigger: 'blur'
                    }
                ],
                draftDate: [
                    {
                        required: true,
                        message: '请选择填表日期',
                        trigger: 'blur'
                    }
                ],
                reason: [
                    {
                        required: true,
                        message: '请输入事由',
                        trigger: 'blur'
                    }
                ],
                sealCategory: [
                    {
                        required: true,
                        message: '请选择印章类别',
                        trigger: 'blur'
                    }
                ],
                sealCategoryInput: [
                    {
                        required: true,
                        message: '请输入印章类别',
                        trigger: 'blur'
                    }
                ],
                typeOfUse1: [
                    {
                        required: true,
                        message: '请选择使用类型',
                        trigger: 'blur'
                    }
                ],
                licenseCategory: [
                    {
                        required: true,
                        message: '请选择证照类型',
                        trigger: 'blur'
                    }
                ],
                licenseCategoryInput: [
                    {
                        required: true,
                        message: '请输入证照类别',
                        trigger: 'blur'
                    }
                ],
                typeOfUse2: [
                    {
                        required: true,
                        message: '请选择使用类型',
                        trigger: 'blur'
                    }
                ],
                number: [
                    {
                        required: true,
                        message: '请填入使用份数',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (value < 1) {
                                callback(new Error('请输入一个正数'))
                            } else {
                                callback()
                            }
                        },
                        message: '请输入一个正数',
                        trigger: 'blur'
                    }
                ],
            }
        };
    },
    methods: {
        closeDialog(mode) {
            this.$emit("closeDialog", mode);
        },
        submit() {
            this.$refs['useSealApprovalForm'].validate(async (valid) => {
                if(valid) {
                    let payload = {
                        ...this.form,
                        projectKeyword: this.projectKeyword
                    }
                    payload.sealCategory = this.form.sealCategory === '其它' ? this.form.sealCategoryInput : this.form.sealCategory
                    payload.licenseCategory = this.form.licenseCategory === '其它' ? this.form.licenseCategoryInput : this.form.licenseCategory
                    
                    let res = await processApi.NewSealUser(payload).catch( err => {
                        this.$message({
                            message: `创建印章使用审批表失败：${ err }`,
                            type: 'error'
                        })
                    })

                    if (res.success) {
                        this.$message({
                            message: '创建印章使用审批表成功！',
                            type: 'success'
                        })
                        this.resetForm()
                        this.closeDialog('refresh')
                    } else {
                        this.$message({
                            message: `创建印章使用审批表失败：${ res.msg }`,
                            type: 'error'
                        })
                    }
                }
            })
        },
        // 重置表单
        resetForm() {
            this.$refs['useSealApprovalForm'].resetFields()
        }
    }
};
</script>

<style lang="scss">
#useSealApproval {
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

