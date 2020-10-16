<!--

    选择关联附件
    :selected.sync 已选中的文件列表

-->

<template>
    <div id="selectAttachment">
        <el-button size="mini" @click="selectDialogShow = true">添加附件</el-button>
        <div class="attachment-list-wrapper">
            <div v-for="i in selected" :key="i.keyword" class="attachment-item">
                <div>{{ i.title }}</div>
                <i class="el-icon-error" @click="reduceSelect(i)"></i>
            </div>
        </div>

        <el-dialog append-to-body :before-close="closeSelectDialog" :visible="selectDialogShow" width="90%" title="选择关联文件">
            <div class="btn-wrapper select-attachment">
                <el-button @click="refreshTree" size="mini">刷新树目录</el-button>
                <el-button @click="refreshDocList" size="mini">刷新文档列表</el-button>
            </div>
            <div class="main-wrapper">
                <div class="tree-wrapper">
                    <el-tree
                        v-if="treeTrigger"
                        :data="attachmentData"
                        node-key="Keyword"
                        :load="loadNode"
                        :lazy="true"
                        :props="treeProps"
                        @node-click="clickProject"
                    >
                        <span class="custom-tree-node" slot-scope="{ node }">
                            <span>{{ node.data.text }}</span>
                        </span>
                    </el-tree>
                </div>
                <!-- 用于拉开目录树div -->
                <!-- <div @touchmove="changeTreeDiv" class="transDiv">

                </div> -->

                <div class="doc-wrapper">
                    <div class="btn-wrapper select-attachment select-filter-header">
                        <span class="select-tip"><span>*</span>已在流程中的文件不可选</span>
                        <div class="search">
                            <el-input
                                size="mini"
                                placeholder="请输入搜索关键字"
                                v-model="filter"
                                class="input-with-select"
                                @change="searchDoc"
                            >
                                <el-button slot="append" icon="el-icon-search" @click="searchDoc"></el-button>
                            </el-input>
                        </div>
                    </div>
                    <el-table
                        v-loading='docListLoading'
                        :data="docList"
                        ref="docList"
                        class="mainTable"
                        height="660px"
                        border
                        row-key="keyword"
                        :load="fileLoad"
                        lazy
                        highlight-current-row
                        :tree-props="fileProps"
                        @selection-change="fileSelectionChange"
                    >
                        <el-table-column :selectable='rowSelectAble' type="selection" width="55" align="center" />
                        <el-table-column
                            label="名称"
                            max-width="25%"
                            min-width="250"
                            sortable
                            show-overflow-tooltip
                        >
                            <template slot-scope="scope">
                                <img :src="scope.row.src" width="20" height="20" alt />
                                <div>{{ scope.row.title }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="O_dmsstatus_DESC"
                            label="文件状态"
                            sortable
                            max-width="5%"
                            min-width="110"
                        />
                        <el-table-column
                            prop="Creater"
                            label="创建者"
                            sortable
                            max-width="7.5%"
                            min-width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="O_credatetime"
                            label="创建时间"
                            sortable
                            max-width="7.5%"
                            min-width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="Updater"
                            label="更新者"
                            sortable
                            max-width="7.5%"
                            min-width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="O_updatetime"
                            label="更新时间"
                            sortable
                            max-width="7.5%"
                            min-width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="O_size"
                            label="文件大小"
                            sortable
                            max-width="5%"
                            min-width="110"
                        />
                        <el-table-column
                            prop="O_filename"
                            label="文件名"
                            sortable
                            max-width="7.5%"
                            min-width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="O_version"
                            label="版本"
                            sortable
                            max-width="5%"
                            min-width="110"
                        />
                        <el-table-column
                            prop="O_outpath"
                            label="输出路径"
                            sortable
                            max-width="7.5%"
                            min-width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="O_flocktime"
                            label="锁定时间"
                            sortable
                            max-width="7.5%"
                            min-width="150"
                            show-overflow-tooltip
                        />
                        <el-table-column
                            prop="O_conode"
                            label="计算机"
                            sortable
                            max-width="7.5%"
                            min-width="150"
                            show-overflow-tooltip
                        />
                    </el-table>
                </div>
            </div>
            <div class="pagenation-wrapper">
                <el-pagination
                    @size-change="limitChange"
                    @current-change="pageChange"
                    :current-page="page"
                    :page-sizes="[25, 50, 75, 100]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="docTotal"
                ></el-pagination>
            </div>
            <div>
                <div>已选中文档：</div>
                <div class="attachment-list-wrapper">
                    <div v-for="i in allSelected" :key="i.keyword" class="attachment-item">
                        <div>{{ i.title }}</div>
                        <i class="el-icon-error" @click="reduceSelect(i)"></i>
                    </div>
                </div>
            </div>
            <div class="btn-wrapper select-attachment" style="padding-top: 10px;">
                <el-button @click="cancel" size="mini">取消选择</el-button>
                <el-button @click="selectDialogShow = false" size="mini" type="primary">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import projectApi from "@/api/services/project";
import docApi from "@/api/services/doc";
import { AddTypeIcon } from "@/util/AddTypeIcon";
import { VersionIcon } from "@/util/VersionIcon";

export default {
    props: {
        // 选中的文件列表
        selected: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            // 控制选择附件的dialog显示
            selectDialogShow: false,

            // 选中的文档列表
            selectedAttachmentList: [],
            // 当前docList中选中的文档列表
            currentSelected: [],

            // 文档树
            attachmentData: [],
            // 树节点的属性
            treeProps: {
                label: "text",
                isLeaf: "leaf"
            },

            // 显示的文档列表
            docList: [],
            // 文档总数
            docTotal: 0,
            // 文档搜索过滤字符串
            filter: "",
            // 页数
            page: 1,
            limit: 25,
            // 当前选中的文件夹
            currentProject: "Root",
            // table 文件节点属性
            fileProps: {
                hasChildren: "HasAttachFiles"
            },

            // 用来刷新树目录
            treeTrigger: true,

            // table 加载中显示
            docListLoading: false,
        };
    },
    async mounted() {
        this.selectedAttachmentList = [];
        this.treeTrigger = false;
        this.attachmentData = await this.getProjectList("Root");
        this.treeTrigger = true;
    },
    methods: {
        // 懒加载文档树节点
        async loadNode(node, resolve) {
            let res = await this.getProjectList(node.data.Keyword);
            if (res) {
                resolve(res);
            } else {
                node.loaded = false;
                node.loading = false;
            }
        },
        // 用户点击一个文件夹
        async clickProject(data /* node */) {
            this.docPage = 1;
            let res = await this.getDocList(data.Keyword);

            if (!res) return;

            this.docList = res.data;
            this.docTotal = res.total;
            this.currentProject = data.Keyword;

        },
        // 刷新树目录
        async refreshTree() {
            this.treeTrigger = false;
            this.attachmentData = await this.getProjectList("Root");
            this.treeTrigger = true;
            // setTimeout(() => {
            //     this.treeTrigger = true;
            // }, 20);
        },
        // 刷新文档列表
        async refreshDocList() {
            if (this.currentProject === "Root") return;

            let res = await this.getDocList(this.currentProject);

            if (!res) return;

            this.docList = res.data;
            this.docTotal = res.total;
        },
        // 搜索文档
        searchDoc() {
            this.page = 1;
            this.refreshDocList();
        },
        /* -----------------------------------------------  */
        // 获取文件夹列表
        async getProjectList(node) {
            // 默认参数 projectType 为 1
            // 会有神秘错误，重试5次
            let retry = 0;
            let res = {};
            while (retry < 5) {
                retry += 1
                res = await projectApi.getProjectList(node, 1);
                if (res.success) break;
            }

            if (res.success) return res.data;
            else
                this.$message({
                    message: `获取文件夹列表失败：${res.msg}`
                });
        },
        // 获取文档列表
        async getDocList(keyword) {
            this.docListLoading = true

            // keyword filterJson page limit
            let filterJson = "";
            if (this.filter) {
                filterJson = [
                    {
                        name: "o_itemname",
                        value: `(o_itemname LIKE '%${this.filter}%' or o_itemdesc LIKE '%${this.filter}%' )`
                    }
                ];
                filterJson = JSON.stringify(filterJson);
            }

            // 设置重试
            let retry = 0
            let res = {}
            while (retry < 5) {
                retry += 1
                res = await docApi.getDocList(keyword, filterJson, this.page, this.limit);
                if (res.success) break;
            }
            
            this.docListLoading = false

            if (!res.success) {
                this.$message({
                    message: `获取文档列表失败：${res.msg}`
                });
                return;
            }

            // 格式化 docList 参数
            res.data = res.data.map(i => {
                return {
                    title: i.Title,
                    fileName: i.O_filename,
                    creator: i.Creater,
                    keyword: i.Keyword,
                    // 图标
                    src: AddTypeIcon(i.O_filename),
                    // raw: i
                    ...i
                };
            });
            return res;
        },
        async getAttachFiles(docKeyword) {
            let res = await docApi.getAttachFiles(docKeyword).catch(err => {
                this.$message({
                    message: `获取文件附件失败：${err.msg}`
                });
            });

            if (!res.success) {
                this.$message({
                    message: `获取文件附件失败：${res.msg}`
                });
                return;
            }
            return res.data[0];
        },
        /* -------------------------------------------------------------- */
        // 用户点击一个文档，加载
        async fileLoad(row, treeNode, resolve) {
            let res = await this.getAttachFiles(row.keyword);

            if (!res) {
                resolve([]);
                return;
            }

            let versionList = res.VersionList.map(i => {
                return {
                    keyword: i.DocInfo[0].Keyword,
                    title: i.DocInfo[0].Title,
                    fileName: i.DocInfo[0].O_filename,
                    ...i.DocInfo[0],
                    src: VersionIcon(i.DocInfo[0].O_version, "VersionList")
                };
            });
            resolve(versionList);
        },

        // 用户选择一个文件
        fileSelectionChange(v) {
            this.currentSelected = v;
        },
        // 分页事件
        limitChange(v) {
            this.limit = v;
            this.refreshDocList();
        },
        pageChange(v) {
            this.page = v;
            this.refreshDocList();
        },
        // 取消选择
        cancel(v) {
            this.selectedAttachmentList = [];
            this.currentSelected = [];
            this.$emit("update:selected", []);
            this.selectDialogShow = false;
            if (this.$refs.docList) {
                this.$refs.docList.clearSelection()
            }
            if (v === 'refresh') {
                this.refreshTree()
                this.refreshDocList()
            }
        },
        // 删除一个选项
        reduceSelect(i) {
            let index = this.selectedAttachmentList
                .map(j => j.keyword)
                .indexOf(i.keyword);
            if (index === -1) {
                index = this.currentSelected
                    .map(j => j.keyword)
                    .indexOf(i.keyword);
                this.currentSelected.splice(index, 1);
                this.$refs.docList.toggleRowSelection(i, false);
            } else {
                this.selectedAttachmentList.splice(index, 1);
            }
        },
        // 关闭选择附件的弹窗
        closeSelectDialog(done) {
            this.selectDialogShow = false
            done(true)
        },
        /* ------------------------------------------------------------- */
        // changeTreeDiv(e) {
        //     console.log('move', e)
        // },
        // 设置doc是否可选中，如果文件已经在流程中，则不可选中
        rowSelectAble(row) {
            if (row.wf_Keyword.length > 0) {
                return false
            } 
            return true
        }
    },
    computed: {
        iconUrl() {
            return AddTypeIcon;
        },
        // 统计所有选中的项
        allSelected() {
            return this.selectedAttachmentList.concat(this.currentSelected);
        },
    },
    watch: {
        docList() {
            // 保存旧的 currentSelected，建立新得 currentSelected
            this.selectedAttachmentList = this.selectedAttachmentList.concat(
                this.currentSelected
            );
            let currentSelectedStore = this.selectedAttachmentList.filter(
                i => this.docList.map(j => j.keyword).indexOf(i.keyword) != -1
            );
            this.selectedAttachmentList = this.selectedAttachmentList.filter(
                i =>
                    currentSelectedStore
                        .map(j => j.keyword)
                        .indexOf(i.keyword) === -1
            );

            this.currentSelected = [];

            this.$nextTick(() => {
                // 设勾选状态
                this.docList.forEach(row => {
                    if (
                        currentSelectedStore
                            .map(i => i.keyword)
                            .indexOf(row.keyword) != -1
                    ) {
                        this.$refs.docList.toggleRowSelection(row, true);
                    }
                });
            });
        },
        allSelected: {
            handler(v) {
                this.$emit("update:selected", v);
            },
        }
    }
};
</script>
<style lang="scss">
#selectAttachment {
    .el-dialog {
        max-width: 700px;
    }
}
.doc-wrapper {
    flex: 1;
    overflow-x: auto;
    .select-tip {
        font-size: 12px;
        color: rgba(0,0,0,0.5);
        float: left;
        span {
            color: red;
        }
    }
}
.tree-wrapper {
    margin-right: 20px;
    max-width: 300px;
    border: solid 1px rgba(0, 0, 0, 0.1);
    height: 700px;
    flex: 1;
    overflow: auto;
    display: flex;
    .el-tree {
        flex: 1;
    }
}
.main-wrapper {
    display: flex;
    .transDiv {
        width: 10px;
        cursor: e-resize;
        margin-right: 20px;
    }
}
.main-wrapper > view {
    width: 50%;
}
.doc-list-wrapper {
    display: flex;
    flex-direction: column;
    margin: 10px;
    .doc-item {
        margin: 10px 0;
        display: flex;
        align-items: center;
    }
    .doc-item > div {
        margin-right: 20px;
    }
}
.selected-show {
    padding: 10px;
    border: solid 1px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-top: 5px;
}
.attachment-list-wrapper {
        padding: 10px;
        border: solid 1px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
    }
.attachment-item {
        display: flex;
        align-items: center;
        margin: 10px;
        i {
            margin-left: 10px;
            cursor: pointer;
        }
    }
</style>
<style>
.doc-wrapper .cell.el-tooltip {
    display: flex;
    align-items: flex-start;
}
.doc-wrapper .cell.el-tooltip img {
    margin-right: 10px;
    margin-left: 5px;
}
.btn-wrapper.select-attachment {
    display: flex;
    justify-content: flex-end;
}
.btn-wrapper.select-attachment.select-filter-header {
    justify-content: space-between;
    align-items: center;
}
.btn-wrapper.select-attachment .search {
    margin-bottom: 10px;
}

.pagenation-wrapper .el-pagination {
    text-align: center;
    margin-top: 20px;
}

</style>