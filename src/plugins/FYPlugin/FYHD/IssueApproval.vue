<!--
    发文审核表
-->

<template>
    <div id="issueApproval">
        <el-dialog
            :visible.sync="showDialog"
            :before-close="closeDialog"
            title="发文审核表"
            width="90%"
            :close-on-click-modal="false"
        >
            <el-form :rules="rules" ref='issueApprovalForm' :model="form" label-width='160px'>
                <el-form-item label='填表日期' prop="draftDate">
                    <el-date-picker
                        v-model="form.draftDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label='发文类型' prop='issueType'>
                    <el-radio v-model="form.issueType" label="规章制度" border size='mini'>规章制度</el-radio>
                    <el-radio v-model="form.issueType" label="内部公文" border size='mini'>内部公文</el-radio>
                    <el-radio v-model="form.issueType" label="对外发文" border size='mini'>对外发文</el-radio>
                </el-form-item>
                <el-form-item label='文件名称' prop="fileName">
                    <el-input v-model="form.fileName" autosize placeholder="请输入文件名称"></el-input>
                </el-form-item>
                <el-form-item label='文件编号' prop="fileNo">
                    <el-input v-model="form.fileNo" autosize placeholder="请输入文件编号"></el-input>
                </el-form-item>
                <el-form-item label='发文对象' prop="issueTarget">
                    <el-input v-model="form.issueTarget" autosize placeholder="请输入发文对象"></el-input>
                </el-form-item>
                <el-form-item label='用印名称' prop='printName'>
                    <el-radio v-model="form.printName" label="公章" border size='mini'>公章</el-radio>
                    <el-radio v-model="form.printName" label="其它" border size='mini'>其它</el-radio>
                </el-form-item>
                <el-form-item label='用印名称-其它' label-width="140px" prop="printNameInput" v-if='form.printName === "其它"'>
                    <el-input v-model="form.printNameInput" placeholder="请输入用印名称"></el-input>
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
                <el-form-item label='有无附件' prop='hasAttachment'>
                    <el-radio v-model="form.hasAttachment" label="有" border size='mini'>有附件</el-radio>
                    <el-radio v-model="form.hasAttachment" label="无" border size='mini'>无附件</el-radio>
                </el-form-item>
                <div style="margin-left: 100px; max-width: 450px" v-show="form.hasAttachment === '有'">
                    <select-attachment ref="selectAttachment" :selected.sync='selected'/>
                </div>
                <el-form-item label='主题词' prop="subjectHeadings">
                    <el-input v-model="form.subjectHeadings" placeholder="请输入主题词"></el-input>
                </el-form-item>
                <el-form-item label="主送人" prop="mainReceiver">
                    <el-button @click="selectMainObj.switch = true" size="small">选择</el-button>
                    <div class="review-user-wrapper">
                        <div v-for="i in form.mainReceiver" :key="i.id">
                            <div>{{ i.text }}</div>
                            <div class="el-icon-error x-icon" @click="reduceMainUser(i.id)"></div>
                        </div>
                    </div>
                    <user-select :dialogObj.sync="selectMainObj" @reUser='reMainUser' @reData='reMainData'></user-select>
                </el-form-item>

                <el-form-item label="抄送人" prop="secondReceiver">
                    <el-button @click="selectSecondObj.switch = true" size="small">选择</el-button>
                    <div class="review-user-wrapper">
                        <div v-for="i in form.secondReceiver" :key="i.id">
                            <div>{{ i.text }}</div>
                            <div class="el-icon-error x-icon" @click="reduceSecondUser(i.id)"></div>
                        </div>
                    </div>
                    <user-select :dialogObj.sync="selectSecondObj" @reUser='reSecondUser' @reData='reSecondData'></user-select>
                </el-form-item>

                <el-form-item label='内容摘要' prop="contentSummary">
                    <el-input type='textarea' :autosize="{ minRows: 3 }" v-model="form.contentSummary" placeholder="请输入内容摘要"></el-input>
                </el-form-item>
                <el-form-item label='拟发布时间' prop="releaseDate">
                    <el-date-picker
                        v-model="form.releaseDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
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
            // 选择的附件
            selected: [],

            // 选择主送人
            selectMainObj: {
                switch: false,
                title: '选择主送人',
                // 限制只能选一个复核人
                limitSingle: true
            },
            // 选择抄送人
            selectSecondObj: {
                switch: false,
                title: '选择抄送人',
                limitSingle: false
            },


            // 密级
            secretLevelOptions: [
                {
                    value: "A",
                    label: "绝密"
                },
                {
                    value: "B",
                    label: "机密"
                },
                {
                    value: "C",
                    label: "秘密"
                },
                {
                    value: "D",
                    label: "无机密"
                },
            ],
            form: {
                // 填表日期
                draftDate: null,
                // 发文类型
                issueType: '',
                // 文件名称
                fileName: '',
                // 文件编号
                fileNo: '',
                // 发文对象
                issueTarget: '',
                // 用印名称
                printName: '',
                // 用印名称自己输入
                printNameInput: '',
                // 密级
                secretLevel: '',
                // 有无附件
                hasAttachment: false,
                // 主题词
                subjectHeadings: '',
                // 主送
                mainReceiver: [],
                // 抄送
                secondReceiver: [],
                // 内容摘要
                contentSummary: '',
                // 拟发布时间
                releaseDate: null,
                // 会审部门
                department: []
            },
            rules: {
                releaseDate: [
                    {
                        required: true,
                        message: '请选择拟发布时间',
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



                issueType: [
                    {
                        required: true,
                        message: '请选择发文类型',
                        trigger: 'blur'
                    }
                ],
                fileName: [
                    {
                        required: true,
                        message: '请输入文件名称',
                        trigger: 'blur'
                    }
                ],
                fileNo: [
                    {
                        required: true,
                        message: '请输入文件编号',
                        trigger: 'blur'
                    }
                ],
                issueTarget: [
                    {
                        required: true,
                        message: '请选择发文对象',
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
                printNameInput: [
                    {
                        required: true,
                        message: '请输入用印名称',
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
                hasAttachment: [
                    {
                        required: true,
                        message: '请选择有无附件',
                        trigger: 'blur'
                    }
                ],
                subjectHeadings: [
                    {
                        required: true,
                        message: '请填写主题词',
                        trigger: 'blur'
                    }
                ],
                mainReceiver: [
                    {
                        required: true,
                        message: '请选择主送人',
                        trigger: 'blur'
                    }
                ],
                contentSummary: [
                    {
                        required: true,
                        message: '请填写内容摘要',
                        trigger: 'blur'
                    }
                ],
                // secondReceiver: [
                //     {
                //         required: true,
                //         message: '请选择抄送人',
                //         trigger: 'blur'
                //     }
                // ],
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
        closeDialog(mode) {
            this.$emit("closeDialog", mode);
        },
        resetForm() {
            this.$refs.selectAttachment.cancel()

            this.$refs['issueApprovalForm'].resetFields()
        },
        submit() {
            this.$refs['issueApprovalForm'].validate(async (valid) => {
                if(valid) {
                    let payload = {
                        ...this.form,
                        projectKeyword: this.projectKeyword,
                        docList: this.form.hasAttachment === '有' ? this.selected.map(i => i.keyword).join(',') : ''
                    }
                    payload.printName = payload.printName === '其它' ? this.form.printNameInput : this.form.printName
                    payload.mainReceiver = this.form.mainReceiver.map(i => i.id).join(',')
                    payload.secondReceiver = this.form.secondReceiver.map(i => i.id).join(',')
                    payload.department = this.form.department.join(',')

                    let res = await processApi.NewSendDocument(payload).catch(err => {
                        this.$message({
                            message: `创建发文审批单失败：${ err }`,
                            type: 'error'
                        })
                    })

                    if (res.success) {
                        this.$message({
                            message: '创建发文审批表成功！',
                            type: 'success'
                        })
                        this.resetForm()
                        this.closeDialog('refresh')
                    } else {
                        this.$message({
                            message: `创建发文审批单失败：${ res.msg }`,
                            type: 'error'
                        })
                    }
                }
            })
        },
        /* -------------------------------------------------------- */
        // 选择主送人
        reMainUser(_, userLabel, userId) {
            let arr = []
            let labels = userLabel.split(',')
            let ids = userId.split(',')
            for (let i in labels) {
                arr.push({
                    text: labels[i],
                    id: ids[i]
                })
            }
            this.selectMainObj.editUserData = arr
            this.form.mainReceiver = this.selectMainObj.editUserData
        },
        reMainData(/*v*/) {
            this.selectMainObj.switch = false
        },
        // 删除主送人
        reduceMainUser(id) {
            let index = this.form.mainReceiver.map(i => i.id).indexOf(id)
            if (index != -1){
                this.form.mainReceiver.splice(index, 1)
            }
            this.selectMainObj.editUserData = this.form.mainReceiver
        },
        // 选择抄送人
        reSecondUser(_, userLabel, userId) {
            let arr = []
            let labels = userLabel.split(',')
            let ids = userId.split(',')
            for (let i in labels) {
                arr.push({
                    text: labels[i],
                    id: ids[i]
                })
            }
            this.selectSecondObj.editUserData = arr
            this.form.secondReceiver = this.selectSecondObj.editUserData
        },
        reSecondData(/*v*/) {
            this.selectSecondObj.switch = false
        },
        // 删除抄送人
        reduceSecondUser(id) {
            let index = this.form.secondReceiver.map(i => i.id).indexOf(id)
            if (index != -1){
                this.form.secondReceiver.splice(index, 1)
            }
            this.selectSecondObj.editUserData = this.form.secondReceiver
        },
    }
};
</script>

<style lang="scss">
#issueApproval {
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

