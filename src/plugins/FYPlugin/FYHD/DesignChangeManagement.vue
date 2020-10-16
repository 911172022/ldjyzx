<!--
    设计变更管理
-->

<template>
    <div id="designChangeManagement">
        <el-dialog
            :visible.sync="showDialog"
            :before-close="closeDialog"
            title="设计变更管理"
            width="90%"
            :close-on-click-modal="false"
        >
            <el-form :rules="rules" ref='disignChangeManagementForm' :model="form" label-width='160px'>
                <el-form-item label='设计变更需求受理' prop='demand'>
                    <el-select v-model="form.demand" size='medium' placeholder="请选择">
                        <el-option
                            v-for="item in demandOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='变更类型' prop="changeType">
                    <el-cascader
                        v-model='form.changeType'
                        :options='changeTypeOptions'
                    ></el-cascader>
                </el-form-item>
                <el-form-item label='描述' prop="desc">
                    <el-input v-model="form.desc" autosize placeholder="请输入描述"></el-input>
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
export default {
    props: {
        showDialog: {
            type: Boolean,
            required: true,
            default: function() {
                return false;
            }
        }
    },
    data() {
        return {
            // 设计变更需求受理
            demandOptions: [
                {
                    value: "A",
                    label: "A）营销宣传部提出的因顾客、营销因素引起的变更"
                },
                {
                    value: "B",
                    label: "B）业主对功能要求提出的变更或设备采购引起的修改变更"
                },
                {
                    value: "C",
                    label: "C）设计单位因设计错漏提出的设计变更"
                },
                {
                    value: "D",
                    label: "D）项目管理部因施工因素提出的设计变更"
                },
                {
                    value: "E",
                    label: "E）项目管理部因施工因素提出的设计变更"
                },
                {
                    value: "F",
                    label: "F）成控招采部因成本优化提出设计变更"
                },
                {
                    value: "G",
                    label: "G）公司管理层提出的设计变更"
                },
                {
                    value: "H",
                    label: "H）其它设计变更"
                }
            ],
            // 变更类型
            changeTypeOptions: [{
                value: 'I',
                label: '重大设计变更',
                children: [{
                    value: '11',
                    label: '涉及销售承诺和买卖合同条款的任何变更'
                },{
                    value: '22',
                    label: '其它重大修订、调整'
                }]
            },{
                value: 'G',
                label: '非重大设计变更',
                children: [{
                    value: '12',
                    label: '金额 < 20万'
                },{
                    value: '23',
                    label: '金额 > 20万'
                }]
            }],
            form: {
                demand: '',
                desc: '',
                changeType: '',
            },
            rules: {
                demand: [
                    {
                        required: true,
                        message: '请选择设计变更需求',
                        trigger: 'blur'
                    }
                ],
                changeType: [
                    {
                        required: true,
                        message: '请选择变更类型',
                        trigger: 'blur'
                    }
                ],
                desc: [
                    {
                        required: true,
                        message: '请输入描述',
                        trigger: 'blur'
                    }
                ],
            }
        };
    },
    methods: {
        closeDialog() {
            this.$emit("closeDialog");
        },
        submit() {
            this.$refs['disignChangeManagementForm'].validate((valid) => {
                    console.log(valid)


                if(valid) {
                    console.log("pass")
                } else {
                    console.log(valid)
                }
            })
        }
    }
};
</script>

<style lang="scss">
#designChangeManagement {
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

