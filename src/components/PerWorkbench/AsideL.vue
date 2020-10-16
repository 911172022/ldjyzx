<template>
    <div class="asideL">
        <el-row>
            <el-col :span="24">
                <el-button style="margin-bottom: 10px" size="small" type="primary" icon="el-icon-user" @click="openUser">用户</el-button>
                <el-button
                style="margin-bottom: 10px"
                    size="small"
                    type="primary"
                    icon="el-icon-user-solid"
                    @click="openUserGroup"
                >用户组</el-button>
            </el-col>
        </el-row>
        <div class="asideLLine" />
        <el-scrollbar v-loading="loading">
            <div class="asideLTreeOuter" @contextmenu.prevent="contextMenuClick">
                <el-tree
                    v-if="showTree"
                    :props="props"
                    :load="loadNode"
                    class="asideLTree Common-Tree-Icon"
                    lazy
                    highlight-current
                    ref="NewUserGroupList"
                    @node-click="handleNodeClick"
                    node-key="text"
                    @node-contextmenu="contextMenuClick"
                ></el-tree>
            </div>
        </el-scrollbar>
        <!-- 右键功能 -->
        <div v-show="menuVisible" class="rightMenu" :style="styleObject">
            <ul class="rightMenu-ul">
                <li
                    v-for="(item, index) in MenuList"
                    :key="index"
                    class="rightMenu-li"
                    :class="item.State === 'Enabled'? '': 'RM-disabled'"
                    @click="getMenuRight(item)"
                >{{ item.Name }}</li>
            </ul>
        </div>
        <User :dialogObj="userData" @reData="reUserData" />
        <UserGroup :dialogObj="userGroupData" @reData="reGroupData" />
        <TreeContextMenu
            @refreshTree="refreshTree"
            :dialogObj="rightData"
            @reData="reData(arguments)"
        />
    </div>
</template>
<script>
import UserApi from "../../api/services/project";
import UserApi2 from "../../api/services/user";
import UserApi3 from "../../api/services/doc";
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            rightData: {
                switch: false,
                editForm: {}
            },
            userData: {
                switch: false
            },
            userGroupData: {
                switch: false
            },
            // collapsed: false,
            // 左侧选单 - 配置选项
            props: {
                label: "text",
                isLeaf: "leaf"
            },
            // 左侧选单 - 右键
            menuVisible: false,
            styleObject: {
                top: 0,
                left: 0,
                opacity: 0,
                position: 'fixed'
            },
            projectId: "",
            NewUserGroupChildren: {},
            node: {},
            resolve: {},
            cccc: "",
            isFirst: true,
            dddd: {},
            loading: true,
            showTree: true
        };
    },
    computed: {
        ...mapGetters("dbsource", ["MenuList"])
    },
    methods: {
        refreshTree() {
            this.showTree = false;
            setTimeout(() => {
                this.showTree = true;
            }, 50);
        },
        // async CreateNewRootProject() {
        //   let vm = this,
        //     Menu = "CreateNewRootProject",
        //     action = "CreateProject";
        //   const res = await UserApi.getMenuRight(vm.projectId, Menu);
        //   if (res.success) {
        //     const res2 = await UserApi.getProjectAttr(action, vm.projectId);
        //     vm.rightData.options = res2.data[0].storagelist;
        //     this.NewUserGroupChildren = undefined;
        //   } else {
        //     this.$message({ message: res.msg, type: "error" });
        //     return;
        //   }
        //   vm.rightData.switch = true;
        //   vm.rightData.Id = "MS_CreateNewRootProject";
        //   vm.rightData.dialogTitle = "新建根目录";
        //   vm.rightData.projectId = this.projectId;
        // },
        async getMenuRight(e) {
            this.foo();
            let vm = this,
                Menu = "CreateNewRootProject",
                action = "CreateProject";
            if (
                e.Id === "MS_CreateNewProject" ||
                e.Id === "MS_CreateNewRootProject" ||
                e.Id === "MS_CreateNewRootProjec_2"
            ) {
                const res = await UserApi.getMenuRight(vm.projectId, Menu);
                if (res.success) {
                    const res2 = await UserApi.getProjectAttr(
                        action,
                        vm.projectId
                    );
                    vm.rightData.options = res2.data[0].storagelist;
                    vm.rightData.from = "perWorkbench";
                    vm.rightData.projectId = vm.projectId;
                    if (
                        e.Id === "MS_CreateNewRootProject" ||
                        e.Id === "MS_CreateNewRootProjec_2"
                    ) {
                        this.NewUserGroupChildren = undefined;
                    }
                } else {
                    this.$message({ message: res.msg, type: "error" });
                    return;
                }
            } else if (e.Id === "MS_ModiProjAttr") {
                (Menu = "ModiProjAttr"), (action = "ModiProject");
                const res = await UserApi.getMenuRight(vm.projectId, Menu);
                if (res.success) {
                    const res2 = await UserApi.getProjectAttr(
                        action,
                        vm.projectId
                    );
                    vm.rightData.options = res2.data[0].storagelist;
                    vm.rightData.editForm.projname = res2.data[0].projname;
                    vm.rightData.editForm.projdesc = res2.data[0].projdesc;
                    vm.rightData.editForm.defname = res2.data[0].defname;
                    vm.rightData.editForm.defdesc = res2.data[0].defdesc;
                    vm.rightData.isHide = res2.data[0].isHide;
                } else {
                    this.$message({ message: res.msg, type: "error" });
                    return;
                }
            } else if (e.Id === "MS_AddFavorites") {
                const res = await UserApi2.addFavorites(vm.projectId);
                if (res.data[0].state === "addSuccess") {
                    this.$message({
                        message: "已添加到收藏夹",
                        type: "success"
                    });
                }
            } else if (e.Id === "MS_CreateNewDoc") {
                (Menu = "CreateNewDoc"), (action = "CreateDoc");
                const res = await UserApi.getMenuRight(vm.projectId, Menu);
                if (res.success) {
                    await UserApi3.getDocAttr(action, vm.projectId);
                } else {
                    this.$message({ message: res.msg, type: "error" });
                    return;
                }
            }
            // MS_DeleteProject, MS_CreateGlobSearch, MS_StartProjectFlow 不用 getMenuRight
            vm.rightData.switch = true;
            vm.rightData.Id = e.Id;
            vm.rightData.dialogTitle = e.Name;
            vm.rightData.projectId = this.projectId;
        },
        reData(e) {
            this.rightData.switch = e[0];
            if (e[1] === "del") {
                return this.$refs.NewUserGroupList.remove(this.cccc);
            } else if (e[1] === "add") {
                let data = {};
                data.projectId = e[2].fullpath;
                data.fullpath = e[2].fullpath;
                data.text = e[2].text;
                data.leaf = false;
                if (this.NewUserGroupChildren === undefined) {
                    // this.node.childNodes = [] // 这里把子节点清空，是因为再次调用 loadNode 的时候会往 childNodes 里 push 节点，所以会有节点重复的情况。
                    // this.loadNode(this.node, this.resolve)
                    this.node.loaded = false;
                    this.node.expand();
                } else {
                    data.fullpath = this.NewUserGroupChildren.data.projectId;
                    this.$set(this.NewUserGroupChildren, "isLeafByUser", false);
                    this.$refs.NewUserGroupList.append(data, this.cccc);
                }
            } else if (e[1] === "edit") {
                this.$set(this.dddd, "text", e[2]);
            }
        },
        openUser() {
            this.userData.switch = true;
        },
        reUserData(e) {
            this.userData.switch = e;
        },
        openUserGroup() {
            this.userGroupData.switch = true;
        },
        reGroupData(e) {
            this.userGroupData.switch = e;
        },
        showMenu(i, status) {
            this.$refs.menuCollapsed.getElementsByClassName(
                "submenu-hook-" + i
            )[0].style.display = status ? "block" : "none";
        },
        handleAvatarSuccess(res, file) {
            console.log(file.name);
            console.log(URL.createObjectURL(file.raw));
        },
        // 左侧选单 - 加载子树数据
        async loadNode(node, resolve) {
            if (this.isFirst) {
                this.node = node;
                this.resolve = resolve;
                this.isFirst = false;
            }
            let nodeKeyword = "Root";
            if (node.data !== undefined) {
                nodeKeyword = node.data.projectId;
            }
            const ProjectType = "5";
            const res = await UserApi.getProjectList(nodeKeyword, ProjectType);

            const rdata = [];
            let ProjectList = res.data.map(item => item.Keyword).join(",");
            const res2 = await UserApi.getChildsDocsCount(ProjectList);
            let nodeFilesTotal = res2.data[0];
            res.data.forEach(item => {
                let str = "";
                if (nodeFilesTotal[item.Keyword] > 0) {
                    str = `${item.text}【${nodeFilesTotal[item.Keyword]}】`;
                } else {
                    str = item.text;
                }
                rdata.push({
                    text: str,
                    leaf: item.leaf,
                    projectId: item.Keyword,
                    fullpath: item.id
                });
            });
            resolve(rdata);
            this.loading = false;
            this.$nextTick(() => {
                this.$refs.NewUserGroupList.setCurrentKey(rdata[0].fullpath);
                const data = {};
                data.fullpath = rdata[0].fullpath;
                this.handleNodeClick(data);
            });
        },
        // 左侧选单 - 节点被点击时的回调
        handleNodeClick(data) {
            this.$store.commit('PerMessage/SET_IS_TABLE', true)
            let str = data.fullpath.split("_").pop();
            var vm = this;
            vm.menuVisible = false;
            const ProjectKeyWord = data.projectId,
                filterJson = "",
                page = 1,
                limit = 50;
            vm.$store.dispatch("doc/getDocList", {
                ProjectKeyWord,
                filterJson,
                page,
                limit
            });
            vm.$store.dispatch("doc/getProjectShowPath", data.fullpath);
            vm.$store.dispatch("doc/getProjectBaseAttr", str);
        },
        // 左侧选单 - 右键
        async contextMenuClick(MouseEvent, object) {
            if (object) {
                this.cccc = object.text;
                this.dddd = object;
            }
            this.NewUserGroupChildren = Node;
            this.menuVisible = false;
            this.menuVisible = true;
            let ProjectList = "",
                Position = "TVProject",
                TvPosition = "1";
            if (object === undefined) {
                this.projectId = "";
                Position = "TVContainer";
            } else {
                this.projectId = object.projectId;
                ProjectList = object.projectId;
            }
            await this.$store.dispatch("dbsource/getMenuList", {
                ProjectList,
                Position,
                TvPosition
            });
            this.styleObject.opacity = 1;
            this.styleObject.left = MouseEvent.clientX + 'px'
            // 如果y坐标的不够显示，就top向上挪到刚好能显示的位置
            let reduce = document.body.clientHeight - MouseEvent.clientY -  this.MenuList.length * 33

            this.styleObject.top = reduce > 0 ? MouseEvent.clientY + 'px' : MouseEvent.clientY + reduce + 'px'
            document.addEventListener("click", this.foo);


            // this.styleObject.top = MouseEvent.clientY - 80 + "px";
            // let aa =
            //     (MouseEvent.clientY + this.$el.getBoundingClientRect().height) /
            //     1.5;
            // // 當 e.clientY + menuHeight >= docHeight 時，菜單向下顯示就會被遮擋了，需要向上顯示
            // if (aa + 80 >= document.body.clientHeight) {
            //     this.styleObject.left = MouseEvent.clientX + "px";
            //     document.addEventListener("click", this.foo);
            // }
        },
        // 左侧选单 - 取消右键
        foo() {
            // 取消鼠标监听事件
            let vm = this;
            vm.menuVisible = false;
            vm.styleObject.opacity = 0;
            vm.styleObject.top = 0;
            vm.styleObject.left = 0;
            document.removeEventListener("mousedown", vm.foo);
        }
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
    }
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
.el-dialog__body {
    border-bottom: 1px solid #dddddd;
    border-top: 1px solid #dddddd;
    padding: 25px 20px;
    margin: 5px 0;
}
</style>
