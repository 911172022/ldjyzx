<template>
    <div class="asideL">
        <h3>
            <i class="el-icon-s-order" style="color: #FFBC40;"></i> 流程分类
        </h3>
        <div class="asideLLine" />
        <el-scrollbar v-loading="loading">
            <div class="asideLTreeOuter">
                <el-tree
                    v-if="treeRefresh"
                    ref="treeBox"
                    :props="props"
                    :load="loadNode"
                    node-key="id"
                    class="asideLTree Common-Tree-Icon"
                    lazy
                    highlight-current
                    @node-click="handleNodeClick"
                />
            </div>
        </el-scrollbar>
    </div>
</template>
<script>
import UserApi from "../../api/services/workflow";
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            // 左侧选单 - 配置选项
            props: {
                label: "name",
                children: "zones",
                isLeaf: "leaf"
            },
            loading: true,
            // 记录被点击的节点的id，用来刷新用
            currentId: "",
            // 刷新树
            treeRefresh: true,
            // 树的当前key
            treeCurrentKeyStore: '',
        };
    },
    computed: {
        /**
         * refreshTrigger 用于刷新当前的流程工作台页面，只要
         * this.$store.commit("workflow/REFRESH_TRIGGER", true)
         * 就可以了
         * 
         */
        ...mapGetters("workflow", ["refreshTrigger"])
    },
    watch: {
        refreshTrigger(newValue, oldValue) {
            if (!oldValue && newValue) {
                this.treeCurrentKeyStore = this.$refs.treeBox.getCurrentKey()

                // 触发刷新
                this.treeRefresh = false 
                setTimeout(() => {
                    this.treeRefresh = true
                    // this.$nextTick(() => {
                    //     this.handleNodeClick({ id: this.currentId });
                    //     this.$store.commit("workflow/REFRESH_TRIGGER", false);
                    // })
                    
                }, 10)
            }
        }
    },
    methods: {
        // 左侧选单 - 加载子树数据
        async loadNode(node, resolve) {
            const nodeKeyword = "";
            const res = await UserApi.getWorkFlowPlaceTree(nodeKeyword);
            const rdata = [];
            res.data.forEach(item => {
                rdata.push({
                    id: item.id,
                    name: item.text,
                    leaf: item.leaf
                });
            });
            resolve(rdata);
            this.loading = false;
            this.$nextTick(() => {
                if (this.refreshTrigger) {
                    this.$refs.treeBox.setCurrentKey(this.treeCurrentKeyStore)
                    this.handleNodeClick({id: this.currentId})
                    this.$store.commit("workflow/REFRESH_TRIGGER", false);
                } else {
                    this.$refs.treeBox.setCurrentKey(rdata[0].id);
                    const data = {};
                    data.id = rdata[0].id;
                    this.handleNodeClick(data);
                }
            });
        },
        // 左侧选单 - 节点被点击时的回调
        handleNodeClick(data) {
            // 记录当前点击的节点 table 的
            this.currentId = data.id;
            const WorkflowType = data.id,
                page = 1;
            this.$store.dispatch("workflow/getWorkFlowPlaceList", {
                WorkflowType,
                page
            });
        }
    }
};
</script>

