<template>
    <div class="mainContainer">
        <div>
            <el-form class="mainSearch" :inline="true" :model="formInline">
                <el-form-item>
                    <el-input v-model="ProjectShowPath" style="width: 100%;" size="small" />
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="formInline.user"
                        placeholder="搜一搜，找得更快"
                        prefix-icon="el-icon-search"
                        size="small"
                        @keyup.enter.native="SearchHandle"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="SearchHandle">查询</el-button>
                </el-form-item>
            </el-form>
            <!--标题,功能-->
            <el-row class="mainTitle DOCmainTitle">
                <!-- <el-col :span="10">
                    <h1><i class="el-icon-s-claim" style="color: #FFBC40;"></i> 文件列表</h1>
                </el-col>-->
                <el-col :span="24">
                    <div style="text-align: right;" class="FunctionMenu">
                        <el-button size="small" type="primary" @click="openWorkTime">填报工时</el-button>
                        <el-button
                            size="small"
                            type="primary"
                            @click="ProjectSetUp"
                            style="margin-right: 10px;"
                        >项目立项</el-button>
                        <UploadFiles :uploadArr="UploadFiles" @reData="reFiles" />
                        <el-button
                            size="small"
                            type="primary"
                            icon="el-icon-download"
                            @click="fileDownload"
                        >下载</el-button>
                        <el-button
                            size="small"
                            type="primary"
                            icon="el-icon-view"
                            @click="PreviewHandle"
                        >预览</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="table-container" ref="tableContainer" id="uploadDrag">
            <!--列表-->
            <div @dragover="fileDragover" @drop="fileDrop">
                <el-table
                    :data="DocList"
                    ref="DocList"
                    class="mainTable"
                    :height="tableHeightLocal"
                    border
                    row-key="Keyword"
                    :load="tableLoad"
                    lazy
                    highlight-current-row
                    :tree-props="treeprops"
                    @row-click="handleCurrentChange"
                    @selection-change="handleSelectionChange"
                    @row-contextmenu="contextMenuClick"
                    :default-sort="{prop: 'date', order: 'descending'}"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column
                        label="名称"
                        max-width="25%"
                        min-width="250"
                        sortable
                        show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            <span class="table-icon">
                                <img :src="scope.row.src" width="20" height="20" alt />
                                {{ scope.row.Title }}
                            </span>
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
            <!-- 右键功能 -->
            <div v-show="menuVisible" class="rightMenu" ref="rightMenu" :style="styleObject">
                <ul class="rightMenu-ul">
                    <li
                        v-for="(item, index) in MenuList"
                        :key="index"
                        class="rightMenu-li"
                        :class="item.State === 'Enabled'? '': 'RM-disabled'"
                        @click="openRight(item)"
                    >{{ item.Name }}</li>
                </ul>
            </div>
            <!-- 右键菜单 -->
            <RowContextMenu :dialogObj="rightData" @reData="reData(arguments)" />
            <!-- 分页 -->
            <pagination :pagination="pagination" @changepage="pageNum2" />
            <!-- 二级弹窗 - 增加用户/用户组 -->
            <PermissionList :dialogObj="PermissionData" @reData="rePData" @reUser="reUser(arguments)" />
            <!-- 选择会签专业 -->
            <ChooseProfession :dialogObj="ChooseProfessionData" @reData="reChooseProfession" />
            <!-- 项目立项 -->
            <ProjectSetUp :dialogObj="ProjectSetUpData" @reData="reProjectSetUp" />
            <!-- 填报工时 -->
            <WorkTime :dialogObj="WorkTimeData" @reData="reWorkTime" />

    </div>
</template>

<script>
import UserApi from "../../api/services/workflow";
import UserApi3 from "../../api/services/doc";
import UserApi4 from "../../api/services/dbsource";
import { VersionIcon } from "../../util/VersionIcon";
import PermissionList from "../Dialog/PermissionList-PM2";
import { mapGetters } from "vuex";
import { BASE_URL } from "../../const";

export default {
    data() {
        return {
            treeprops: {
                hasChildren: "HasAttachFiles",
            },
            id: "",
            formInline: {
                user: "",
                region: "",
            },
            multipleSelection: [],
            // 左侧选单 - 右键
            menuVisible: false,
            styleObject: {
                top: 0,
                left: 0,
                opacity: 0,
            },
            rightData: {
                switch: false,
            },
            UploadFiles: [], //  上传文件列表
            uploadVisible: false,
            colors: [
                { color: "#409eff", percentage: 0 },
                { color: "#6f7ad3", percentage: 100 },
            ],
            uploadSelection: [], // 上传checkbox
            // 开始上传中
            Uploading: false,
            DocKeyword: "",
            // 二级弹窗 - 增加用户/用户组
            PermissionData: {
                switch: false,
            },
            // 返回流程
            reProcessData: {},

            // 右键替换文件
            isReplaceFile: false,

            // 上傳文件
            beforeFile: null,

            MenuList: [],
            len: 0,

            maps: new Map(),
            pid: "",

            // ZY start
            ChooseProfessionData: {
                switch: false,
                docKeyWord: [],
            },
            ProjectSetUpData: {
                switch: false,
            },
            WorkTimeData: {
                switch: false,
            },
            // ZY end
            tableHeightLocal: 600
        };
    },
    components: {
        PermissionList,
    },
    computed: {
        ...mapGetters("doc", [
            "DocList",
            "pagination",
            "ProjectKeyWord",
            "ProjectShowPath",
        ]),
        ...mapGetters("PerMessage", ["AttachmentDocData"]),
        ...mapGetters("menu", ["tableHeight"]),
    },
    watch: {
        // 个人消息附件跳转过来
        AttachmentDocData: {
            handler(newValue) {
                setTimeout(() => {
                    this.handleCurrentChange(newValue);
                }, 2000);
            },
        },
    },
    mounted() {
        setTimeout(() => {
            this.getTableHeight()
        }, 10)
        window.onresize = () => {
            this.getTableHeight()
        }
    },
    destroyed() {
        window.onresize = null
    },
    methods: {
        // 获取表格高度
        getTableHeight() {
            this.$nextTick(() => {
                this.tableHeightLocal = this.$refs.tableContainer.clientHeight
            })
        },
        //  ZY start
        openChooseProfession() {
            this.ChooseProfessionData.switch = true;
        },
        reChooseProfession(e) {
            this.ChooseProfessionData.switch = e;
        },
        ProjectSetUp() {
            this.ProjectSetUpData.switch = true;
        },
        reProjectSetUp(e) {
            this.ProjectSetUpData.switch = e;
        },
        openWorkTime() {
            this.WorkTimeData.switch = true;
        },
        reWorkTime(e) {
            this.WorkTimeData.switch = e;
        },
        //  ZY end
        async PreviewHandle() {
            if (this.DocKeyword) {
                UserApi3.previewDoc(this.DocKeyword).then((res) => {
                    if (res.success) {
                        let arr = res.data[0].filename.split(".");
                        let str = arr.pop();
                        if (str === "pdf" || str === "png" || str === "jpg") {
                            window.open(
                                `${BASE_URL}/${res.data[0].path}`,
                                "_blank"
                            );
                        } else if (str === "txt") {
                            this.$message.error("文件不存在");
                        } else {
                            let RefDocKeyword = "";
                            UserApi3.fileDownload(
                                this.DocKeyword,
                                RefDocKeyword
                            ).then((res2) => {
                                if (res2.success) {
                                    let webHttp = `${BASE_URL}/${res2.data[0].path}`;
                                    window.open(
                                        `https://view.officeapps.live.com/op/view.aspx?src=${webHttp}`,
                                        "_blank"
                                    );
                                } else {
                                    this.$message.error(res2.msg);
                                }
                            });
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            } else {
                this.$message.error("请选择文件");
            }
        },
        reFiles() {
            let { pid } = this;
            const { tree, treeNode, resolve } = this.maps.get(pid);
            this.$set(this.$refs.DocList.store.states.lazyTreeNodeMap, pid, []);
            this.tableLoad(tree, treeNode, resolve);
        },
        async tableLoad(tree, treeNode, resolve) {
            let rdata = [],
                imgUrl = "",
                arr = [];
            this.pid = tree.Keyword;
            this.maps.set(this.pid, { tree, treeNode, resolve });
            const res = await UserApi3.getAttachFiles(tree.Keyword);
            if (res.success && res.data[0].VersionList) {
                // 参考
                arr = res.data[0].RefDocList;
                if (arr.length > 0) {
                    arr.forEach((item) => {
                        imgUrl = VersionIcon(
                            item.DocInfo[0].O_version,
                            "RefDocList"
                        );
                        rdata.push({
                            Title: item.DocInfo[0].Title,
                            O_dmsstatus_DESC: item.DocInfo[0].O_dmsstatus_DESC,
                            Creater: item.DocInfo[0].Creater,
                            O_credatetime: item.DocInfo[0].O_credatetime,
                            Updater: item.DocInfo[0].Updater,
                            O_updatetime: item.DocInfo[0].O_updatetime,
                            O_size: item.DocInfo[0].O_size,
                            O_filename: item.DocInfo[0].O_filename,
                            O_version: item.DocInfo[0].O_version,
                            O_outpath: item.DocInfo[0].O_outpath,
                            O_flocktime: item.DocInfo[0].O_flocktime,
                            O_conode: item.DocInfo[0].O_conode,
                            src: imgUrl,
                            Keyword: item.DocInfo[0].Keyword,
                            HasAttachFiles: false,
                        });
                    });
                }
                // 版本
                arr = res.data[0].VersionList;
                arr.forEach((item) => {
                    imgUrl = VersionIcon(
                        item.DocInfo[0].O_version,
                        "VersionList"
                    );
                    rdata.push({
                        Title: item.DocInfo[0].Title,
                        O_dmsstatus_DESC: item.DocInfo[0].O_dmsstatus_DESC,
                        Creater: item.DocInfo[0].Creater,
                        O_credatetime: item.DocInfo[0].O_credatetime,
                        Updater: item.DocInfo[0].Updater,
                        O_updatetime: item.DocInfo[0].O_updatetime,
                        O_size: item.DocInfo[0].O_size,
                        O_filename: item.DocInfo[0].O_filename,
                        O_version: item.DocInfo[0].O_version,
                        O_outpath: item.DocInfo[0].O_outpath,
                        O_flocktime: item.DocInfo[0].O_flocktime,
                        O_conode: item.DocInfo[0].O_conode,
                        src: imgUrl,
                        Keyword: item.DocInfo[0].Keyword,
                        HasAttachFiles: false,
                    });
                });
            }
            resolve(rdata);
        },
        // 搜索
        async SearchHandle() {
            let vm = this,
                { ProjectKeyWord } = vm,
                filterJson = [],
                page = 1,
                limit = 50;
            filterJson.push(
                {
                    name: "o_itemname",
                    value: `(o_itemname LIKE '%${this.formInline.user}%' or o_itemdesc LIKE '%${this.formInline.user}%' )`,
                },
                { name: "searchAttr", value: "true" },
                { name: "filterstr", value: this.formInline.user }
            );
            filterJson = JSON.stringify(filterJson);
            this.$store.dispatch("doc/getDocList", {
                ProjectKeyWord,
                filterJson,
                page,
                limit,
            });
        },
        // 拖拽上传 - 拖拽
        fileDragover(e) {
            e.preventDefault();
        },
        // 拖拽上传 - 放置
        fileDrop(e) {
            e.preventDefault();
            this.UploadFiles = [];
            // // 获取到第一个上传的文件对象
            let files = [];
            e.dataTransfer.files.forEach((item) => {
                files.push(item);
            });
            this.UploadFiles = files;
        },
        // 下载
        async fileDownload() {
            let { DocKeyword } = this,
                RefDocKeyword = "";
            if (DocKeyword) {
                const res = await UserApi3.fileDownload(
                    DocKeyword,
                    RefDocKeyword
                );
                if (res.success) {
                    location.href = `${BASE_URL}/${res.data[0].path}`;
                } else {
                    this.$message.error(res.msg);
                }
            } else {
                this.$message.error("请选择文件");
            }
        },
        // 開啟添加用戶彈窗
        openPermissionList() {
            this.PermissionData.switch = true;
        },
        // 添加用戶彈窗 返回
        rePData(e) {
            this.PermissionData.switch = e;
        },
        async reUser(e) {
            let vm = this;
            if (e[2] !== undefined) {
                let DocList = vm.DocKeyword,
                    WfKeyword = vm.reProcessData.o_code,
                    userlist = e[2];
                const res = await UserApi.startNewWorkFlow(
                    DocList,
                    WfKeyword,
                    userlist
                );
                if (res.success) {
                    const filterJson = "",
                        page = 1,
                        limit = 50;
                    let { ProjectKeyWord } = vm;
                    vm.$store.dispatch("doc/getDocList", {
                        ProjectKeyWord,
                        filterJson,
                        page,
                        limit,
                    });
                }
            }
        },
        // 点击列表
        handleCurrentChange(val) {
            let vm = this;
            if (val !== null) {
                vm.$refs.DocList.clearSelection();
                vm.$refs.DocList.toggleRowSelection(val);
                // if (val.Keyword === vm.DocKeyword) return
                vm.DocKeyword = val.Keyword;
                vm.$store.dispatch("doc/getDocBaseAttr", val.Keyword);
            }
        },
        // 多选列表
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 右键列表
        openRight(e) {
            let vm = this,
                arr = [];
            if (e.Id === "MS_DeleteDoc") {
                this.multipleSelection.forEach((item) => {
                    arr.push(item.Keyword);
                });
                vm.rightData.DocKeyword = arr;
            } else if (e.Id === "MS_ReplaceDoc") {
                this.isReplaceFile = true;
                this.$nextTick(() => {
                    document.getElementById("ReplaceFile").click();
                });
                return;
            } else if (e.Id === "MS_PreviewDoc") {
                this.PreviewHandle();
                return;
            } else {
                vm.rightData.DocKeyword = vm.DocKeyword;
            }
            vm.rightData.switch = true;
            vm.rightData.Id = e.Id;
            vm.rightData.dialogTitle = e.Name;
            this.rightData.projectId = this.ProjectKeyWord
        },
        reData(e) {
            if (e[1].o_code !== undefined) {
                this.reProcessData = e[1];
                this.openPermissionList();
            } else {
                const filterJson = "",
                    page = 1,
                    limit = 50;
                let { ProjectKeyWord } = this;
                this.$store.dispatch("doc/getDocList", {
                    ProjectKeyWord,
                    filterJson,
                    page,
                    limit,
                });
            }
            this.rightData.switch = e[0];
        },
        // 左侧选单 - 右键
        contextMenuClick(row, column, event) {
            // 取消事件的默认动作
            event.preventDefault();
            let vm = this;
            if (vm.multipleSelection.length === 0) {
                vm.$refs.DocList.clearSelection();
                vm.$refs.DocList.toggleRowSelection(row);
            } else {
                let index = vm.multipleSelection.findIndex(
                    (item) => item.Keyword === row.Keyword
                );
                if (index === -1) {
                    vm.$refs.DocList.clearSelection();
                    vm.$refs.DocList.toggleRowSelection(row);
                }
            }
            vm.DocKeyword = row.Keyword;
            vm.menuVisible = false;
            vm.menuVisible = true;
            let ProjectList = row.Keyword,
                Position = "LVDoc",
                TvPosition = "1";
            // vm.$store.dispatch('dbsource/getMenuList', { ProjectList, Position, TvPosition })
            UserApi4.getMenuList(ProjectList, Position, TvPosition).then(
                (res) => {
                    vm.MenuList = res.data;
                    vm.len = res.data.length * 33;
                    vm.styleObject.opacity = 1;
                    // getBoundingClientRect 獲取視窗寬高
                    if (
                        event.clientY >
                        vm.$el.getBoundingClientRect().height / 1.1
                    ) {
                        vm.styleObject.top = event.clientY - vm.len - 10 + "px";
                    } else if (
                        event.clientY >
                        vm.$el.getBoundingClientRect().height / 1.3
                    ) {
                        vm.styleObject.top =
                            event.clientY - vm.len + 100 + "px";
                    } else {
                        vm.styleObject.top = event.clientY - 10 + "px";
                    }
                    vm.styleObject.left = event.clientX + 30 + "px";
                }
            );

            // vm.styleObject.top = event.clientY + 'px'
            // vm.styleObject.left = event.clientX + 10 + 'px'
            document.addEventListener("click", vm.foo);
        },
        // 左侧选单 - 取消右键
        foo() {
            // 取消鼠标监听事件
            let vm = this;
            vm.menuVisible = false;
            vm.styleObject.opacity = 0;
            vm.styleObject.top = 0;
            vm.styleObject.left = 0;
            document.removeEventListener("click", vm.foo);
        },
        // 分页
        pageNum2(e) {
            let page = e,
                { ProjectKeyWord } = this;
            const filterJson = "",
                limit = 50;
            this.$store.dispatch("doc/getDocList", {
                ProjectKeyWord,
                filterJson,
                page,
                limit,
            });
        },
    },
};
</script>

<style lang="scss">
.rightMenu {
    position: absolute;
    top: 163px;
    left: 37px;
    z-index: 2131;
    display: block;
    opacity: 1;
    box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 7px 2px;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    border-radius: 0.3rem;
    .rightMenu-ul {
        position: relative;
        z-index: 100;
        min-width: 150px;
        border: none;
        padding: 5px 0 10px;
        margin: 0;
        list-style: none;
        .rightMenu-li {
            height: 32px;
            border-bottom: 1px dotted #ccc;
            line-height: 34px;
            font-size: 14px;
            color: #717171;
            margin: 0 10px;
            padding: 0 10px;
            list-style: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .rightMenu-li:last-child {
            border-bottom: 0;
        }
        .rightMenu-li:hover {
            background: #528ffd;
            color: #fff;
        }
        .RM-disabled {
            pointer-events: none;
            color: rgb(187, 187, 187);
        }
    }
}
</style>
<style scoped>
.mainContainer {
    display: flex;
    flex-direction: column;
}
.mainContainer .table-container {
    overflow: hidden;
    flex: 1;
}
</style>