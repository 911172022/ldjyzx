<template>
    <div class="PWmainContainer">
        <div ref="tableContainer">
            <!--列表-->
            <el-table
                :data="workflowList"
                ref="DocList"
                class="mainTable PWmainTable"
                :height="tableHeightLocal"
                border
                highlight-current-row
                @row-click="handleCurrentChange"
                @selection-change="handleSelectionChange"
                @row-contextmenu="contextMenuClick"
                :default-sort="{prop: 'date', order: 'descending'}"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column
                    prop="File"
                    label="文件名称"
                    max-width="20%"
                    min-width="200"
                    sortable
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="DefWorkFlow"
                    label="流程名称"
                    sortable
                    max-width="20%"
                    min-width="200"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="Creater"
                    label="发起人"
                    sortable
                    max-width="20%"
                    min-width="100"
                    show-overflow-tooltip
                />
                <el-table-column
                    prop="CreateDate"
                    label="发送时间"
                    sortable
                    max-width="20%"
                    min-width="100"
                    show-overflow-tooltip
                />
            </el-table>
        </div>
        <!-- 标题 -->
        <!-- <el-row class="mainTitle">
        <el-col :span="24">
            <h1><i class="el-icon-s-claim" style="color: #FFBC40;"></i> 流程列表</h1>
        </el-col>
        </el-row>-->
        
        <!-- 分页 -->
        <pagination :pagination="pagination" @changepage="pageNum2" />

        <!-- 因为这里的右键文件的Keyword根本没有文件type，文件夹的话一跳转就bug -->
        <!-- 右键功能 -->
        <!-- <div v-show="menuVisible" class="rightMenu" ref="rightMenu" :style="styleObject">
            <ul class="rightMenu-ul">
                <li class="rightMenu-li Enabled" @click="getDocLocation">转到源目录</li>
            </ul>
        </div> -->
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import UserApi from "../../api/services/project";
// import UserApi2 from "../../api/services/";

export default {
    data() {
        return {
            // 消息列表
            currentRow: null,
            multipleSelection: [],
            menuVisible: false,
            styleObject: {
                top: 0,
                left: 0
            },
            // 用于源文件跳转
            DocKeyword: "",
            // 表格高度
            tableHeightLocal: 600,
        };
    },
    mounted() {
        this.resetTableHeight()
        window.onresize = () => {
            return (() => {
				this.resetTableHeight()
			})()
            
        }
    },
    destroyed() {
        window.onresize = null
    },
    updated() {
        if (this.$refs.vueCropper) {
            this.$refs.vueCropper.Update();
        }
    },
    computed: {
        ...mapGetters("workflow", [
            "workflowList",
            "pagination",
            "WorkflowType"
        ]),
        ...mapGetters("menu", ["tableHeight"])
    },
    methods: {
        // 重设表格高度
        resetTableHeight() {
            this.$nextTick(() => {
                this.tableHeightLocal = this.$refs.tableContainer.clientHeight
            })
        },
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then(() => {
                    done();
                })
                .catch(() => {});
        },
        // 点击列表
        handleCurrentChange(val) {
            this.currentRow = val;
            this.$store.dispatch("workflow/getWorkFlow", val.Keyword);
        },
        // 多选列表
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 分页
        pageNum2(e) {
            let page = e;
            let { WorkflowType } = this;
            this.$store.dispatch("workflow/getWorkFlowPlaceList", {
                WorkflowType,
                page
            });
        },
        beforeClose() {
            this.uploadList.pop();
            this.cropperModel = false;
        },
        // 左侧选单 - 右键
        contextMenuClick(row, column, event) {
            this.rightDoc = row;
            // 取消事件的默认动作
            event.preventDefault();
            let vm = this;
            if (vm.multipleSelection.length === 0) {
                vm.$refs.DocList.clearSelection();
                vm.$refs.DocList.toggleRowSelection(row);
            } else {
                let index = vm.multipleSelection.findIndex(
                    item => item.Keyword === row.Keyword
                );
                if (index === -1) {
                    vm.$refs.DocList.clearSelection();
                    vm.$refs.DocList.toggleRowSelection(row);
                }
            }
            vm.DocKeyword = row.Keyword;
            vm.menuVisible = false;
            vm.menuVisible = true;
            vm.styleObject.top = event.clientY + "px";
            vm.styleObject.left = event.clientX + 10 + "px";
            document.addEventListener("click", vm.foo);
        },
        // 左侧选单 - 取消右键
        foo() {
            // 取消鼠标监听事件
            let vm = this;
            vm.menuVisible = false;
            vm.styleObject.top = 0;
            vm.styleObject.left = 0;
            document.removeEventListener("click", vm.foo);
        },
        // 跳转到源文件
        // 跳转
        // async getDocLocation() {
        //     // 获取 ProjectKeyWord
        //     let IgnoreShortCut = "false";
        //     // const res = await UserApi.getProjectPath(Keyword, IgnoreShortCut);
        //     // if (res.success) {
        //     //     const ProjectKeyWord = res.data[0].ProjectKeyword;
        //     //     //  储存位置
        //     //     await UserApi.saveLastProject(ProjectKeyWord);
        //     //     this.$router.push({ name: "DocManagement" });
        //     //     //  获取列表
        //     //     // const filterJson = '', page = 1, limit = 50
        //     //     // const res3 = await UserApi3.getDocList(ProjectKeyWord, filterJson, page, limit)
        //     //     // if (res3.success) {
        //     //     //   let KeywordList = res3.data.filter(item => item.Keyword === Keyword)
        //     //     //   this.$store.commit('PerMessage/ATTACHMENT_MOVE_DOC', KeywordList[0])
        //     //     // }
        //     // }
        // }
    }
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
.PWmainContainer {
    display: flex;
    flex-direction: column;
}
.PWmainContainer > div:first-child {
    flex: 1;
    overflow: auto;
}
</style>