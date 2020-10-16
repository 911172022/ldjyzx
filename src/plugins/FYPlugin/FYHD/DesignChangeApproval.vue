<!--

    设计变更审批表

-->
<template>
    <div id="designChangeApproval">
        <el-dialog
            :visible.sync="showDialog"
            :before-close="closeDialog"
            title="设计变更审批"
            width="90%"
            :close-on-click-modal="false"
        >
            <el-form
                :rules="rules"
                ref="designChangeApprovalForm"
                :model="form"
                label-width="140px"
            >
                <!-- 单号 -->
                <doc-number title="文档编号" :number.sync="form.number"></doc-number>

                <el-form-item label='项目名称' prop="projectName">
                    <el-input v-model="form.projectName" autosize placeholder="请输入项目名称"></el-input>
                </el-form-item>
                <el-form-item label="呈报部门" prop="reportingDepartment">
                    <triage-department :selected.sync="form.reportingDepartment"></triage-department>
                </el-form-item>
                <el-form-item label="设计变更名称" prop="designChangeName">
                    <el-input v-model="form.designChangeName" autosize placeholder="请输入设计变更名称"></el-input>
                </el-form-item>
                <el-form-item label='拟文日期' prop='proposerDate'>
                    <el-date-picker
                        v-model="form.proposerDate"
                        type="date"
                        placeholder="选择拟文日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="变更增/减总金额" prop="totalPrice">
                    <el-input
                        type="number"
                        v-model.number="form.totalPrice"
                        autosize
                        placeholder="请输入变更增/减总金额"
                    ></el-input>
                </el-form-item>
                <el-form-item label="提出阶段" prop="raiseStage">
                    <el-input v-model="form.raiseStage" autosize placeholder="请输入提出阶段"></el-input>
                </el-form-item>
                <el-form-item label="合同名称" prop="contractName">
                    <el-input v-model="form.contractName" autosize placeholder="请输入合同名称"></el-input>
                </el-form-item>
                <el-form-item label="合同编号" prop="contractNo">
                    <el-input v-model="form.contractNo" autosize placeholder="请输入合同编号"></el-input>
                </el-form-item>
                <el-form-item label="设计单位" prop="designUnit">
                    <el-input v-model="form.designUnit" autosize placeholder="请输入设计单位"></el-input>
                </el-form-item>

                <div class="block-show">
                    <span class="label">变更原因</span>
                    <div class="form-item">
                        <el-form-item label="提出方" prop="proposer">
                            <el-radio v-model="form.proposer" label="我司">我司</el-radio>
                            <el-radio v-model="form.proposer" label="设计公司">设计公司</el-radio>
                            <el-radio v-model="form.proposer" label="施工方">施工方</el-radio>
                        </el-form-item>
                        <el-form-item label="具体原因" prop="specificReason">
                            <el-cascader v-model="form.specificReason" :options="specificReasonOptions"></el-cascader>
                        </el-form-item>
                        <!-- <el-form-item label="变更类型" prop="changeType">
                            <el-radio v-model="form.changeType" label="重大设计变更">重大设计变更</el-radio>
                            <el-radio v-model="form.changeType" label="非重大设计变更">非重大设计变更</el-radio>
                            <el-radio v-model="form.changeType" label="营销买卖合同变更">营销买卖合同变更</el-radio>
                            <el-radio v-model="form.changeType" label="其他重大变更">其他重大变更</el-radio>
                        </el-form-item>
                        <el-form-item label="涉及销售承诺和买卖合同条款的任何变更" label-width="350px" prop="invoSalesContract" v-if="form.changeType === '重大设计变更'">
                            <el-radio v-model="form.invoSalesContract" label="是">是</el-radio>
                            <el-radio v-model="form.invoSalesContract" label="否">否</el-radio>
                        </el-form-item> -->
                        <el-form-item label='变更类型' prop="changeType">
                            <el-cascader
                                v-model='form.changeType'
                                :options='changeTypeOptions'
                            ></el-cascader>
                        </el-form-item>
                    </div>
                </div>

                <el-form-item label="变更部位现状及修改内容" prop="content">
                    <el-input
                        v-model="form.content"
                        type="textarea"
                        :autosize="{ minRows: 4 }"
                        placeholder="请输入变更部位现状及修改内容"
                    ></el-input>
                </el-form-item>

                <el-form-item label="变更知会专业" prop="major">
                    <el-checkbox-group v-model="form.major">
                        <el-checkbox  label="建筑">建筑</el-checkbox>
                        <el-checkbox label="结构">结构</el-checkbox>
                        <el-checkbox label="给排水">给排水</el-checkbox>
                        <el-checkbox label="电气">电气</el-checkbox>
                        <el-checkbox label="暖通燃气">暖通燃气</el-checkbox>
                        <el-checkbox label="室内">室内</el-checkbox>
                        <el-checkbox label="景观">景观</el-checkbox>
                        <el-checkbox label="其它">其它</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <!-- <el-form-item label='款项是否超过200万' prop="over200" label-width="160px">
                    <el-radio v-model="form.over200" label="是" border size='mini'>是</el-radio>
                    <el-radio v-model="form.over200" label="否" border size='mini'>否</el-radio>
                </el-form-item> -->

                <select-attachment
                    ref="selectAttachment"
                    :selected.sync='form.attachmentList'
                />
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog">取 消</el-button>
                <el-button type="primary" size="small" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import docNumber from "./common/docNumber.vue";
import triageDepartment from './common/triageDepartment.vue'
import selectAttachment from './common/selectAttachment.vue'
import processApi from './api/process'


export default {
    components: {
        docNumber,
        triageDepartment,
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
            required: true,
        }
    },
    data() {
        return {
            // 变更类型
            changeTypeOptions: [{
                value: '重大设计变更',
                label: '重大设计变更',
                children: [{
                    value: '涉及销售承诺和买卖合同条款的任何变更',
                    label: '涉及销售承诺和买卖合同条款的任何变更'
                },{
                    value: '其它重大修订、调整',
                    label: '其它重大修订、调整'
                }]
            },{
                value: '非重大设计变更',
                label: '非重大设计变更',
                children: [{
                    value: '金额 < 20万',
                    label: '金额 < 20万'
                },{
                    value: '金额 > 20万',
                    label: '金额 > 20万'
                }]
            }],
            // 具体原因的选项
            specificReasonOptions: [
                {
                    value: "设计类",
                    label: "设计类",
                    children: [
                        {
                            value: "错误",
                            label: "错误"
                        },
                        {
                            value: "缺漏",
                            label: "缺漏"
                        },
                        {
                            value: "超限额设计成本指标",
                            label: "超限额设计成本指标"
                        },
                        {
                            value: "优化",
                            label: "优化"
                        },
                        {
                            value: "二次设计",
                            label: "二次设计"
                        }
                    ]
                },
                {
                    value: "施工类",
                    label: "施工类",
                    children: [
                        {
                            value: "现场条件",
                            label: "现场条件"
                        },
                        {
                            value: "施工质量",
                            label: "施工质量"
                        },
                        {
                            value: "施工错误",
                            label: "施工错误"
                        },
                        {
                            value: "施工进度要求",
                            label: "施工进度要求"
                        },
                        {
                            value: "施工工艺",
                            label: "施工工艺"
                        }
                    ]
                },
                {
                    value: "营销类",
                    label: "营销类",
                    children: [
                        {
                            value: "客户需求",
                            label: "客户需求"
                        },
                        {
                            value: "策划补充修改",
                            label: "策划补充修改"
                        }
                    ]
                },
                {
                    value: "开发类",
                    label: "开发类",
                    children: [
                        {
                            value: "政策法规",
                            label: "政策法规"
                        },
                        {
                            value: "垄断行业要求",
                            label: "垄断行业要求"
                        }
                    ]
                },
                {
                    value: "其它类",
                    label: "其它类",
                    children: [
                        {
                            value: "领导决策",
                            label: "领导决策"
                        },
                        {
                            value: "其它",
                            label: "其它"
                        }
                    ]
                }
            ],
            form: {
                // 单号
                number: "",
                // 呈报部门
                reportingDepartment: [],
                // 设计变更名称
                designChangeName: '',
                // 变更增/减总金额
                totalPrice: null,
                // 提出阶段
                raiseStage: '',
                // 合同名称
                contractName: '',
                // 合同编号
                contractNo: '',
                // 设计单位
                designUnit: '',
                // 提出方
                proposer: '',
                // 具体原因
                specificReason: '',
                // 变更类型
                changeType: '',
                // 变更部位现状及修改内容
                content: '',
                // 变更知会专业
                major: [],
                
                // 拟文日期
                proposerDate: '',
                // 项目名称
                projectName: '',
                // 款项超过200
                over200: '',

                // 附件列表
                attachmentList: [],
                // 是否涉及销售承诺及买卖合同条款
                invoSalesContract: ''
            },
            rules: {
                projectName: [
                    {
                        required: true,
                        message: "请输入项目名称",
                        trigger: "blur"
                    }
                ],
                over200: [
                    {
                        required: true,
                        message: "请选择款项是否超过200万",
                        trigger: "blur"
                    }
                ],
                proposerDate: [
                    {
                        required: true,
                        message: '请选择拟文日期',
                        trigger: 'blur'
                    },
                    {
                        type: "date",
                        message: '请输入一个日期',
                        tirgger: 'blur'
                    }
                ],
                number:  [
                    {
                        required: true,
                        message: "请输入单号",
                        trigger: "blur"
                    }
                ],
                reportingDepartment:  [
                    {
                        required: true,
                        message: "请输入呈报部门",
                        trigger: "blur"
                    }
                ],
                designChangeName:  [
                    {
                        required: true,
                        message: "请输入设计变更名称",
                        trigger: "blur"
                    }
                ],
                totalPrice:  [
                    {
                        required: true,
                        message: "请输入变更增/减金额",
                        trigger: "blur"
                    }
                ],
                raiseStage:  [
                    {
                        required: true,
                        message: "请输入提出阶段",
                        trigger: "blur"
                    }
                ],
                contractName:  [
                    {
                        required: true,
                        message: "请输入合同名称",
                        trigger: "blur"
                    }
                ],
                contractNo:  [
                    {
                        required: true,
                        message: "请输入合同编号",
                        trigger: "blur"
                    }
                ],
                designUnit:  [
                    {
                        required: true,
                        message: "请输入设计单位",
                        trigger: "blur"
                    }
                ],
                proposer:  [
                    {
                        required: true,
                        message: "请选择提出方",
                        trigger: "blur"
                    }
                ],
                specificReason:  [
                    {
                        required: true,
                        message: "请输入具体原因",
                        trigger: "blur"
                    }
                ],
                changeType:  [
                    {
                        required: true,
                        message: "请选择变更类型",
                        trigger: "blur"
                    }
                ],
                content:  [
                    {
                        required: true,
                        message: "请输入变更部位现状及修改内容",
                        trigger: "blur"
                    }
                ],
                major:  [
                    {
                        required: true,
                        message: "请选择变更知会专业",
                        trigger: "blur"
                    }
                ],
                invoSalesContract: [
                    {
                        required: true,
                        message: "请选择是否涉及销售承诺及买卖条款合同",
                        trigger: "blur"
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
            this.$refs["designChangeApprovalForm"].validate(async valid => {
                if (valid) {
                    let payload = {
                        ...this.form,
                        specificReason1: this.form.specificReason[0],
                        specificReason2: this.form.specificReason[1],
                        changeType1: this.form.changeType[0],
                        changeType2: this.form.changeType[1],
                        docList: this.form.attachmentList.map(i => i.keyword).join(','),
                        projectKeyword: this.projectKeyword,
                    }

                    // if (this.form.changeType[0] === '非重大设计变更') {
                    //     payload.over20 = this.form.changeType[1]
                    // }
                    
                    // if (payload.changeType !== '重大设计变更') {
                    //     payload.invoSalesContract = ''
                    // }

                    payload.reportingDepartment = this.form.reportingDepartment.join(',')
                    payload.major = this.form.major.join(',')

                    let res = await processApi.NewDesignChange(payload).catch(err => {
                        this.$message({
                            message: `提交表单错误${ err }`,
                            type: 'error'
                        })
                        return {}
                    })

                    if (res.success) {
                        this.$message({
                            message: '提交设计变更审批表成功！',
                            type: 'success',
                            duration: 6000
                        })
                        this.resetForm()
                        this.closeDialog('refresh')
                    } else {
                        this.$message({
                            message: `提交设计变更审批表失败：${ res.msg }`,
                            type: 'error'
                        })
                    }
                }
            });
        },
        // 重置表单
        resetForm() {
            this.$refs['designChangeApprovalForm'].resetFields()
            this.$refs.selectAttachment.cancel()
        }
    }
};
</script>

<style lang="scss">
#designChangeApproval {
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

<style lang="scss">
.el-dialog {
    .block-show {
        margin: 10px 0;
        border-radius: 5px;
        .label {
            font-size: 16px;
            margin-bottom: 10px;
            display: block;
        }
        .form-item {
            border: solid 1px rgba(0, 0, 0, 0.1);
        }
    }
}
</style>

