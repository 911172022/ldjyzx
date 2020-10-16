<template>
    <el-dialog
        v-if="isFirst"
        class="dialogTemplate"
        title="模板选择"
        :visible.sync="dialogObj.switch"
        :before-close="dialogClose"
        append-to-body
    >
        <div style="margin-bottom: 10px;text-align: right;">
            <span>提示:</span>
            <img :src="TemplateDocIcon" width="15px" style="vertical-align: text-bottom;" alt />
            <span style="padding-left: 5px;">文档模版使用</span>
            <img :src="TemplateProIcon" width="15px" style="vertical-align: text-bottom;" alt />
            <span style="padding-left: 5px;">目录模版使用</span>
        </div>
        <el-scrollbar>
            <el-tree
                :load="TemplateloadNode"
                ref="TemplateList"
                lazy
                :props="props"
                class="Common-Tree-Icon"
                @node-click="handleNodeClick"
                highlight-current
                node-key="text"
                :default-expanded-keys="DefaultNode"
            >
                <template slot-scope="{ node }">
                    <span>
                        <img
                            :src="TemplateIconChange(node.isLeaf)"
                            width="20px"
                            style="vertical-align: text-bottom;"
                        />
                        <span style="padding-left: 5px;">{{ node.label }}</span>
                    </span>
                </template>
            </el-tree>
        </el-scrollbar>
        <span slot="footer">
            <el-button size="small" @click="dialogClose">取 消</el-button>
            <el-button type="primary" size="small" @click="TemplateHandle">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import UserApi from "../../api/services/project";
import { Doc_TemplateIconChange } from "@/util/Common";
import { TemplateDocIcon, TemplateProIcon } from "../../const";

export default {
    props: {
        dialogObj: {
            type: Object,
            required: true,
            default: () => ({
                switch: false
            })
        }
    },
    data() {
        return {
            // 默认展开的节点
            DefaultNode: ["所有模板"],
            // 模板配置
            props: {
                label: "text",
                isLeaf: "leaf"
            },
            // 初始值
            nodeKeyword: "Root",
            // 节点
            TreeNodeData: {},
            // 关闭时销毁 treeData
            isFirst: false,
            // 模版图标提示用
            TemplateDocIcon,
            TemplateProIcon
        };
    },
    watch: {
        dialogObj: {
            handler(newValue) {
                if (newValue.switch) this.isFirst = true;
                else return;
            },
            deep: true
        }
    },
    methods: {
        // 切换目录树图标
        TemplateIconChange(isleaf) {
            return Doc_TemplateIconChange(isleaf);
        },
        async TemplateloadNode(node, resolve) {
            if (node.level === 0) {
                return resolve([{ text: "所有模板" }]);
            }
            if (node.data.fullpath !== undefined) {
                this.nodeKeyword = node.data.fullpath;
            }
            const res = await UserApi.getTempDefList(this.nodeKeyword);
            const rdata = [];
            res.data.forEach(item => {
                rdata.push({
                    text: item.text,
                    leaf: item.leaf,
                    fullpath: item.id,
                    type: item.type,
                    iconCls: item.iconCls
                });
            });
            resolve(rdata);
        },
        // tree 点击节点
        handleNodeClick(data) {
            console.log(data);
            this.TreeNodeData = data;
        },
        // 確認
        TemplateHandle() {
            let vm = this;
            if (vm.TreeNodeData.type !== vm.dialogObj.type)
                return vm.$message({
                    message: "请选择对应模板",
                    type: "error"
                });
            let str = vm.TreeNodeData.text,
                arr = str.split("__"),
                TemplateData = {};
            TemplateData.defname = arr[0];
            TemplateData.defdesc = arr[1];
            TemplateData.defkeyid = vm.TreeNodeData.fullpath;
            TemplateData.type = vm.TreeNodeData.type;
            vm.$emit("reTemplate", TemplateData);
            vm.dialogClose();
        },
        // 关闭弹窗
        dialogClose() {
            this.$emit("reData", false);
            this.isFirst = false;
            this.nodeKeyword = "Root";
        }
    }
};
</script>
<style lang="scss">
.dialogTemplate {
    .el-dialog {
        width: 40%;
        .el-dialog__body {
            height: 400px;
        }
    }
}
</style>
