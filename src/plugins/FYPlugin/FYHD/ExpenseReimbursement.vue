<!--
    费用报销单
-->

<template>
    <div id="expenseReimbursement">
        <el-dialog
            :visible.sync="showDialog"
            :before-close="closeDialog"
            title="报销费用单"
            width="90%"
            :close-on-click-modal="false"
        >
            <el-form label-position='left' ref="expenseReimbursementForm" :model="form" :rules="rules">
                <el-form-item label='申请日期' prop="draftDate">
                    <el-date-picker
                        v-model="form.draftDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label='文档编号' prop="docNumber">
                    <el-input v-model="form.docNumber" autosize placeholder="请输入文档编号"></el-input>
                </el-form-item>
                    
                <el-table
                    :summary-method="getSummaries"
                    border
                    show-summary
                    :data="form.reimbursementList"
                    stripe
                    style="width: 100%"
                >
                    <el-table-column prop="reason" label="支付事由" width="180">
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="`reimbursementList.${ scope.$index }.reason`"
                                :rules="rules.reason"
                            >
                                <el-input v-model="scope.row.reason" autosize placeholder="请输入支付事由"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="number" label="数量" width="180">
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="`reimbursementList.${ scope.$index }.number`"
                                :rules="rules.number"
                            >
                                <el-input
                                    v-model.number="scope.row.number"
                                    type="number"
                                    autosize
                                    placeholder="请输入数量"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位">
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="`reimbursementList.${ scope.$index }.unit`"
                                :rules="rules.unit"
                            >
                                <el-input v-model="scope.row.unit" autosize placeholder="请输入单位"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price" label="单价">
                        <template slot-scope="scope">
                            <el-form-item
                                :prop="`reimbursementList.${ scope.$index }.price`"
                                :rules="rules.price"
                            >
                                <el-input
                                    type="number"
                                    v-model.number="scope.row.price"
                                    autosize
                                    placeholder="请输入单价"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="total" label="金额（元）">
                        <template slot-scope="scope">
                            <el-form-item :prop="`reimbursementList.${ scope.$index }.total`">
                                <el-input
                                    disabled
                                    :value="scope.row.price * scope.row.number"
                                    autosize
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column width="40px">
                        <template slot-scope="scope">
                            <i
                                v-if="form.reimbursementList.length > 1"
                                class="el-icon-error reduce-icon"
                                @click="reduceList(scope.$index)"
                            ></i>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="add-btn-wrapper">
                    <el-button @click="addRow">增添一行</el-button>
                </div>

                <el-row>
                    <!-- <el-col :span="10">
                        <el-form-item label-width="80px" label="受款人" prop="recipients">
                            <el-input v-model="form.recipients" autosize placeholder="请输入受款人"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label-width="160px" label="合计金额（小写）" prop="totalPriceLow">
                            <el-input v-model.number="form.totalPriceLow" type="number" placeholder="请输入合计金额"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label-width="160px" label="合计金额（大写）" prop="totalPriceUpper">
                            <el-input v-model="form.totalPriceUpper" autosize placeholder="请输入合计金额"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="90px" label="单据份数" prop="docNum">
                            <el-input
                                v-model.number="form.docNum"
                                type="number"
                                autosize
                                placeholder="请输入单据份数"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="未能取得票据原因" prop="reasonForNoDoc">
                    <el-input
                        type="textarea"
                        v-model="form.reasonForNoDoc"
                        :autosize='{ minRows: 3 }'
                        placeholder="请输入原因"
                    ></el-input>
                </el-form-item>
                <select-attachment ref='selectAttachment' :selected.sync='selected'/>
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
import { ConvertMoneyToChineseCapital } from '@/util/Common'
import processApi from './api/process'


export default {
    components: {
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
    },
    data() {
        return {
            selected: [],
            form: {
                // 文档编号
                docNumber: '',
                // 申请日期
                draftDate: null,
                demand: "",
                desc: "",
                changeType: "",
                //报销单列表
                reimbursementList: [
                    {
                        // 支付事由
                        reason: "",
                        // 数量
                        number: null,
                        // 单位
                        unit: "",
                        // 单价
                        price: null,
                        // 总价
                        total: 0
                    }
                ],
                // // 受款人
                // recipients: "",
                // 单据份数
                docNum: null,
                // 未能取得票据原因
                reasonForNoDoc: "",

                // 合计金额小写
                totalPriceLow: null,
                // 合计金额大写
                totalPriceUpper: '',
            },

            rules: {
                docNumber: [
                    {
                        required: true,
                        message: '请填写文档编号',
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
                recipients: [
                    {
                        required: true,
                        message: "请填写受款人",
                        trigger: "blur"
                    }
                ],
                docNum: [
                    {
                        required: true,
                        message: "请输入单据份数",
                        trigger: "blur"
                    }
                ],
                reason: [
                    {
                        required: true,
                        message: "请填写支付事由",
                        trigger: "blur"
                    }
                ],
                number: [
                    {
                        required: true,
                        message: "请填写数量",
                        trigger: "blur"
                    },
                    {
                        type: "number",
                        trigger: "blur",
                        message: '请输入一个数字'
                    },
                    {
                        validator: this.validateNum,
                        trigger: "blur"
                    }
                ],
                unit: [
                    {
                        required: true,
                        message: "请填写单位",
                        trigger: "blur"
                    }
                ],
                price: [
                    {
                        type: "number",
                        trigger: "blur"
                    },
                    {
                        required: true,
                        message: "请填写数量",
                        trigger: "blur"
                    }
                ],
                totalPriceLow: [
                    {
                        type: "number",
                        trigger: "blur"
                    },
                    {
                        required: true,
                        message: "请填写总金额",
                        trigger: "blur"
                    }
                ],
                totalPriceUpper: [
                    {
                        required: true,
                        message: "请填写总金额",
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
        // 重置表单
        resetForm() {
            this.$refs['expenseReimbursementForm'].resetFields()
            this.$refs.selectAttachment.cancel()
        },
        submit() {
            this.$refs["expenseReimbursementForm"].validate(async valid => {
                if (valid) {
                    let payload = {
                        ...this.form,
                        docList: this.selected.map(i => i.keyword).join(','),
                        projectKeyword: this.projectKeyword
                    }
                    
                    let res = await processApi.NewReimbursement(payload).catch(err => {
                        this.$message({
                            message: `创建报销单失败：${ err }`,
                            type: 'error'
                        })
                    })

                    if (res.success) {
                        this.$message({
                            message: '创建报销单成功！',
                            type: 'success'
                        })
                        this.resetForm()
                        this.closeDialog('refresh')
                    } else {
                        this.$message({
                            message: `创建报销单失败：${ res.msg }`,
                            type: 'error'
                        })
                    }

                }
            });
        },
        // 验证正数
        validateNum: (rule, value, callback) => {
            if (value < 0) {
                callback(new Error("不得小于0"));
            } else {
                callback();
            }
        },
        // 合计规则
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = "总价";
                    return;
                }
                if (index != columns.length - 2) {
                    sums[index] = "";
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index] += " 元";
                } else {
                    sums[index] = "N/A";
                }
            });

            return sums;
        },
        // 增添一行
        addRow() {
            this.form.reimbursementList.push({
                // 支付事由
                reason: "",
                // 数量
                number: null,
                // 单位
                unit: "",
                // 单价
                price: null,
                // 总价
                total: 0
            });
        },
        // 删除一行
        reduceList(index) {
            if (index >= 0) {
                this.form.reimbursementList.splice(index, 1);
            }
        }
    },
    computed: {
        // 计算总价
        totalComputed(row) {
            return row.number * row.price;
        },
        totalPriceLow() {
            return this.form.totalPriceLow
        },
    },
    watch: {
        form: {
            handler(newValue) {
                newValue.reimbursementList.forEach(i => {
                    i.total = i.number * i.price;
                });
            },
            immediate: true,
            deep: true
        },
        totalPriceLow(v) {
            if (v) {
                this.form.totalPriceUpper = ConvertMoneyToChineseCapital(v)
            } else {
                this.form.totalPriceUpper = ''
            }
        }
    }
};
</script>

<style lang="scss">
#expenseReimbursement {
    .el-dialog {
        max-width: 900px;
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
    .el-form-item {
        margin-bottom: 15px;
    }
    .cell {
        text-align: center;
    }
    .reduce-icon {
        cursor: pointer;
    }
    .el-form-item__content {
        position: relative;
    }
    .add-btn-wrapper {
        text-align: right;
        padding: 20px 0;
    }
}
</style>

