<!--
    鹤洞业务审批表
-->

<template>
    <div id="HDBusinessApproval">
        <el-dialog
            :visible.sync="showDialog"
            :before-close="closeDialog"
            title="鹤洞业务审批表"
            width="90%"
            :close-on-click-modal="false"
        >
            <el-form :rules="rules" ref='HDBusinessApprovalForm' :model="form" label-width='100px'>
                <el-form-item label='填表日期' prop="draftDate">
                    <el-date-picker
                        v-model="form.draftDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label='合同编号' prop="docNumber">
                    <el-input v-model="form.docNumber" autosize placeholder="请输入合同编号"></el-input>
                </el-form-item>
                <el-form-item label='呈批事项' prop="submissions">
                    <el-input v-model="form.submissions" autosize placeholder="请输入呈批事项"></el-input>
                </el-form-item>
                <el-form-item label='密级' prop='secretLevel'>
                    <el-select v-model="form.secretLevel" size='medium' placeholder="请选择密级">
                        <el-option
                            v-for="item in secretLevelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='用印名称' prop='printName'>
                    <el-radio v-model="form.printName" label="公章" border size='mini'>公章</el-radio>
                    <el-radio v-model="form.printName" label="其它" border size='mini'>其它</el-radio>
                </el-form-item>
                <el-form-item label='用印名称-其它' label-width="140px" prop="printNameInput" v-if='form.printName === "其它"'>
                    <el-input v-model="form.printNameInput" placeholder="请输入用印名称"></el-input>
                </el-form-item>
                <el-form-item label='有无附件' prop='hasAttachment'>
                    <el-radio v-model="form.hasAttachment" label="有" border size='mini'>有附件</el-radio>
                    <el-radio v-model="form.hasAttachment" label="无" border size='mini'>无附件</el-radio>
                </el-form-item>
                <div style="margin-left: 100px; max-width: 450px" v-show="form.hasAttachment === '有'">
                    <select-attachment ref="selectAttachment" :selected.sync='selected'/>
                </div>

                <el-form-item label='内容摘要' prop="summary">
                    <el-input type='textarea' v-model="form.summary" :autosize='{ minRows: 3 }' placeholder="请输入内容摘要"></el-input>
                </el-form-item>
                <div>
                    <el-form-item :rules='rules.relational' :label='index === 0 ? "业务联系方": ""' :prop="`relational.${ index }.value`" v-for='(i, index) in form.relational' :key="index">
                        <div class="row-wrapper">
                            <el-input v-model="form.relational[index].value" autosize placeholder="请输入业务关联方"></el-input>
                            <i class='el-icon-remove-outline reduce-icon' v-if="form.relational.length > 1" @click="reduceRelational(index)"></i>
                            <i class="el-icon-circle-plus-outline reduce-icon" v-if="index === form.relational.length - 1" @click='addRelational'></i>
                        </div>
                        
                    </el-form-item>
                </div>
                <el-form-item label='涉及金额' prop="amountinvolved">
                    <el-input type='number' v-model.number="form.amountinvolved" autosize placeholder="请输入涉及金额"></el-input>
                </el-form-item>
                <el-form-item label='时间期限' prop="deadline">
                    <el-date-picker
                        v-model="form.deadline"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="选择复核人" prop="reviewUser">
                    <el-button @click="userSelectObj.switch = true" size="small">选择</el-button>
                    <div class="review-user-wrapper">
                        <div v-for="i in form.reviewUser" :key="i.id">
                            <div>{{ i.text }}</div>
                            <div class="el-icon-error x-icon" @click="reduceReviewUser(i.id)"></div>
                        </div>
                    </div>
                    <user-select :dialogObj.sync="userSelectObj" @reUser='reUser' @reData='reData'></user-select>
                </el-form-item>
                <el-form-item label="会审部门" prop="department">
                    <triage-department :selected.sync="form.department"></triage-department>
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
import selectAttachment from './common/selectAttachment.vue'
import userSelect from "@/components/Dialog/PermissionList-PM2";
import triageDepartment from './common/triageDepartment.vue'
import processApi from './api/process'


export default {
    components: {
        selectAttachment,
        userSelect,
        triageDepartment
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
        }
    },
    data() {
        return {
            // 选中的附件列表
            selected: [],

            // 选择用户的
            userSelectObj: {
                switch: false,
                title: '选择复核人',
                // 限制只能选一个复核人
                limitSingle: true
            },

            // 密级
            secretLevelOptions: [
                {
                    value: "绝密",
                    label: "绝密"
                },
                {
                    value: "机密",
                    label: "机密"
                },
                {
                    value: "秘密",
                    label: "秘密"
                },
                {
                    value: "无密级",
                    label: "无密级"
                },
            ],
            form: {
                // 合同编号
                docNumber: '',
                // 填表日期
                draftDate: null,

                // 呈批事项
                submissions: '',
                // 密级
                secretLevel: '',
                // 用印名称
                printName: '',
                // 有无附件
                hasAttachment: '',
                // 内容摘要
                summary: '',
                // 业务关联方
                relational: [{
                    value: ''
                }],
                // 涉及金额
                amountinvolved: null,
                // 时间期限
                deadline: null,
                
                // 用户输入
                // 用印名称-其它
                printNameInput: '',


                // 复核人
                reviewUser: [],
                // 会审部门
                department: [],
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
                submissions: [
                    {
                        required: true,
                        message: '请输入呈批事项',
                        trigger: 'blur'
                    }
                ],
                secretLevel: [
                    {
                        required: true,
                        message: '请选择密级',
                        trigger: 'blur'
                    }
                ],
                printName: [
                    {
                        required: true,
                        message: '请选择用印名称',
                        trigger: 'blur'
                    }
                ],
                hasAttachment: [
                    {
                        required: true,
                        message: '请选择有无附件',
                        trigger: 'blur'
                    }
                ],
                summary: [
                    {
                        required: true,
                        message: '请输入内容摘要',
                        trigger: 'blur'
                    }
                ],
                relational: [
                    {
                        required: true,
                        message: '请输入业务关联方',
                        trigger: 'blur'
                    }
                ],
                amountinvolved: [
                    {
                        required: true,
                        message: '请输入涉及金额',
                        trigger: 'blur'
                    }
                ],
                deadline: [
                    {
                        required: true,
                        message: '请输入时间期限',
                        trigger: 'blur'
                    }
                ],
                printNameInput: [
                    {
                        required: true,
                        message: '请输入用印名称',
                        trigger: 'blur'
                    }
                ],
                reviewUser: [
                    {
                        required: true,
                        message: '请选择复核人',
                        trigger: 'blur'
                    }
                ],
                department: [
                    {
                        required: true,
                        message: '请选择会审部门',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        // 选择用户的组件
        reUser(_, userLabel, userId) {
            let arr = []
            let labels = userLabel.split(',')
            let ids = userId.split(',')
            for (let i in labels) {
                arr.push({
                    text: labels[i],
                    id: ids[i]
                })
            }
            this.userSelectObj.editUserData = arr
            this.form.reviewUser = this.userSelectObj.editUserData
        },
        reData(/* v */) {
            this.userSelectObj.switch = false
        },


        closeDialog(mode) {
            this.$emit("closeDialog", mode);
        },
        submit() {
            this.$refs['HDBusinessApprovalForm'].validate(async (valid) => {
                if(valid) {
                    let payload = {
                        ...this.form,
                        docList: this.form.hasAttachment === '有' ? this.selected.map(i => i.keyword).join(',') : '',
                        projectKeyword: this.projectKeyword
                    }
                    payload.relational = this.form.relational.map(i => i.value).join(',')
                    payload.printName = this.form.printName === '其它' ? this.form.printNameInput : this.form.printName
                    payload.reviewUser = this.form.reviewUser.map(i => i.id).join(',')
                    payload.department = this.form.department.join(',')
                    
                    let res = await processApi.NewBusiness(payload).catch(err => {
                        this.$message({
                            message: `创建业务审批单失败：${ err }`,
                            type: 'error'
                        })
                    })

                    console.log(res)
                    if (res.success) {
                        this.$message({
                            message: `创建业务审批单成功`,
                            type: 'success'
                        })
                        this.resetForm()
                        this.closeDialog('refresh')
                    } else {
                        this.$message({
                            message: `创建业务审批表失败：${ res.msg }`,
                            type: 'error'
                        })
                    }


                }
            })
        },
        // 加一个业务联系方
        addRelational() {
            this.form.relational.push({
                value: ''
            })
        },
        // 减一个业务联系方
        reduceRelational(index) {
            this.form.relational.splice(index, 1)
        },
        // 减一个复核人
        reduceReviewUser(id) {
            let index = this.form.reviewUser.map(i => i.id).indexOf(id)
            if (index != -1){
                this.form.reviewUser.splice(index, 1)
            }
            this.userSelectObj.editUserData = this.form.reviewUser
        },
        // 重置表单
        resetForm() {
            this.$refs['HDBusinessApprovalForm'].resetFields()
            this.$refs.selectAttachment.cancel()
        }
    }
};
</script>

<style lang="scss">
#HDBusinessApproval {
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

<style lang="scss" scoped>
#HDBusinessApproval {
    .reduce-icon {
        font-size: 20px;
        margin-left: 20px;
        vertical-align: middle;
        cursor: pointer;
    }
    .row-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>

