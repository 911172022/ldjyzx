<!--
    方圆鹤洞项目
    用来分发显示的表单
    :showDialog 控制显示 dialog
    :processId 要显示的表单流程的 id
    :editForm 当这个表单是修改表单或者需要初始化的值时，填充这个（保留）
    :projectKeyword 右键哪个文件夹的keyword
    :docKeyword 右键哪个文档的keyword
-->

<template>
    <div id="FYHEDistribute">
        <!-- 设计变更管理流程图 -->
        <design-change-management
            v-if="processId === 'DesignChangeManagement'"
            :editForm="editForm"
            :showDialog="showDialog"
            @closeDialog="closeDialog"
        />
        <!-- 付款通知单 -->
        <payment-notice
            v-if="processId === 'FY_NewPaymentNotice'"
            :editForm="editForm"
            :showDialog="showDialog"
            @closeDialog="closeDialog"
            :projectKeyword="projectKeyword"
        />
        <!-- 鹤洞业务审批表 -->
        <HD-business-approval
            v-if="processId === 'FY_NewBusiness'"
            :editForm="editForm"
            :showDialog="showDialog"
            @closeDialog="closeDialog"
            :projectKeyword="projectKeyword"
        />
        <!-- 印章使用审批表 -->
        <use-seal-approval
            v-if="processId === 'FY_NewSealUse'"
            :editForm="editForm"
            :showDialog="showDialog"
            @closeDialog="closeDialog"
            :projectKeyword="projectKeyword"
        />
        <!-- 费用报销单 -->
        <expense-reimbursement
            v-if="processId === 'FY_NewReimbursement'"
            :editForm="editForm"
            :showDialog="showDialog"
            @closeDialog="closeDialog"
            :projectKeyword='projectKeyword'
        />
        <!-- 发文审批表 -->
        <issue-approval
            v-if="processId === 'FY_SendDocument'"
            :editForm="editForm"
            :showDialog="showDialog"
            @closeDialog="closeDialog"
            :projectKeyword="projectKeyword"
        />
        <!-- 通用事务审批流程 -->
        <transaction
            v-if="processId === 'FY_NewTransaction'"
            :editForm="editForm"
            :showDialog="showDialog"
            @closeDialog="closeDialog"
            :projectKeyword="projectKeyword"
            :docKeyword="docKeyword"
        />
        <!-- 合同审批表 -->
        <contract-approval
            v-if="processId === 'FY_NewContractApproval'"
            :editForm="editForm"
            :showDialog="showDialog"
            @closeDialog="closeDialog"
            :projectKeyword="projectKeyword"
        />

        <!-- 设计变更审批表 -->
        <design-change-approval
            v-if="processId === 'FY_NewDesignChange'"
            :editForm="editForm"
            :showDialog="showDialog"
            @closeDialog="closeDialog"
            :projectKeyword="projectKeyword"
        ></design-change-approval>
    </div>
</template>

<script>
// 设计变更管理
import DesignChangeManagement from "./DesignChangeManagement.vue";
// 付款通知单
import PaymentNotice from "./PaymentNotice.vue";
// 印章使用审批
import useSealApproval from "./useSealApproval.vue";
// 鹤洞业务审批表
import HDBusinessApproval from "./HDBusinessApproval.vue";
// 费用报销单
import ExpenseReimbursement from "./ExpenseReimbursement.vue";
// 发文审批表
import IssueApproval from "./IssueApproval.vue";
// 通用事务审批流程
import Transaction from "./Transaction.vue";
// 合同审批表
import ContractApproval from "./ContractApproval.vue";
// 设计变更审批表
import DesignChangeApproval from "./DesignChangeApproval.vue";

export default {
    props: {
        // 控制显示dialog
        showDialog: {
            type: Boolean,
            required: true,
            default: function() {
                return false;
            }
        },
        // 流程id
        processId: {
            type: String,
            required: true
        },
        // 原始的表单内容，表单里的 value
        editForm: {
            type: Object,
            required: true
        },
        // 选中的 文件夹keyword
        projectKeyword: {
            type: String,
            required: false,
            default: function() {
                return "";
            }
        },
        // 选中的文档keyword
        docKeyword: {
            type: String,
            required: false,
            default: function() {
                return "";
            }
        }
    },
    components: {
        DesignChangeManagement,
        PaymentNotice,
        useSealApproval,
        HDBusinessApproval,
        ExpenseReimbursement,
        IssueApproval,
        Transaction,
        ContractApproval,
        DesignChangeApproval
    },
    mounted() {},
    methods: {
        closeDialog(mode) {
            this.$emit("closeDialog", mode);
        }
    }
};
</script>

<style lang="scss">
.review-user-wrapper {
    border: solid 1px rgba(0, 0, 0, 0.1);
    padding: 0 10px;
    border-radius: 5px;
    min-height: 20px;
}
.review-user-wrapper > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .x-icon {
        cursor: pointer;
    }
}
</style>