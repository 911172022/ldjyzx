<template>
    <div id='selectUser'>
        <el-dialog
            v-if="isFirst"
            class="addUser"
            :title="dialogObjtitle.title"
            :visible.sync="dialogObj.switch"
            width="90%"
            :append-to-body="true"
            :before-close="dialogClose"
        >
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-tabs v-model="userName">
                        <el-tab-pane class="addUser_User" label="用户" name="user">
                            <el-table
                                ref="userData"
                                :data="userData"
                                tooltip-effect="dark"
                                class="userData"
                                height="490"
                                border
                                @row-dblclick="addUserDblclick"
                            >
                                <el-table-column prop="text" label="用户名"></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane class="addUser_UserGroup" label="组织架构" name="userGroup">
                            <div class="UserGroup">
                                <div class="AU-search">
                                    <el-input
                                        placeholder="搜索用户"
                                        v-model="SearchUserText"
                                        size="small"
                                        prefix-icon="el-icon-search"
                                    />
                                </div>
                                <div class="AU-tree">
                                    <el-tree
                                        class="filter-tree Common-Tree-Icon"
                                        :load="loadNode"
                                        lazy
                                        :props="props"
                                        highlight-current
                                        ref="UserGroupList"
                                        @node-click="handleNodeClick"
                                        node-key="text"
                                        :default-expanded-keys="DefaultNode"
                                    >
                                        <template slot-scope="{ node }">
                                            <span>
                                                <img
                                                    :src="TreeIconChange(node.isLeaf)"
                                                    width="20px"
                                                    style="vertical-align: text-bottom;"
                                                />
                                                <span style="padding-left: 5px;">{{ node.label }}</span>
                                            </span>
                                        </template>
                                    </el-tree>
                                </div>
                                <div class="AU-table">
                                    <el-table
                                        :data="userGroupData"
                                        highlight-current-row
                                        height="250"
                                        style="width: 100%"
                                        @row-dblclick="addUserDblclick"
                                    >
                                        <el-table-column prop="text" label="用户名" />
                                    </el-table>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
                <el-col :span="12" style="padding-top: 55px;">
                    <el-table
                        class="addUserData"
                        ref="addUserData"
                        :data="addUserData"
                        tooltip-effect="dark"
                        height="490"
                        border
                        @row-dblclick="deleteDblclick"
                    >
                        <el-table-column prop="text" label="用户名" />
                    </el-table>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogClose">取 消</el-button>
                <el-button type="primary" size="small" @click="addUserHandle">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import UserApi from "../../api/services/user";
import { Doc_TreeIconChange } from "@/util/Common";

export default {
    props: {
        dialogObj: {
            type: Object,
            // 没有传参时才会被读取
            default: () => ({
                switch: false,
                title: "增加用户/用户组",
                // 限制只能选择一个用户
                limitSingle: false
            })
        }
    },
    data() {
        return {
            // 切換用戶,用戶組
            userName: "user",
            // 用户列表
            userData: [],
            // 用戶組列表
            userGroupData: [],
            // 搜索用户
            SearchUserText: "",
            TimeId: -1,
            // 默认展开的节点
            DefaultNode: ["所有组织架构"],
            // 模板配置
            props: {
                label: "text",
                isLeaf: "leaf"
            },
            nodeKeyword: "Root",
            GroupKeyword: "",
            // 添加用户列表
            addUserData: [],
            Users: "",
            UserList: "",
            // 关闭时销毁 treeData
            isFirst: false
        };
    },
    computed: {
        // 有传参, 但没有传 title
        dialogObjtitle() {
            return Object.assign(
                {
                    title: "增加用户/用户组"
                },
                this.dialogObj
            );
        }
    },
    watch: {
        dialogObj: {
            handler(newValue) {
                if (newValue.switch) {
                    this.isFirst = true;
                    // 個人消息 - 回復 - 已有用戶
                    if (newValue.editUserData !== undefined) {
                        this.addUserData = newValue.editUserData;
                    }
                    this.getAllUserList(this.nodeKeyword);
                } else return;
            },
            deep: true
        },
        SearchUserText() {
            clearTimeout(this.TimeId);
            this.TimeId = setTimeout(() => {
                this.getAllUserList(this.GroupKeyword);
            }, 500);
        }
    },
    methods: {
        // 切换目录树图标
        TreeIconChange(isleaf) {
            return Doc_TreeIconChange(isleaf);
        },
        // 加载子树数据
        async loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve([{ text: "所有组织架构" }]);
            }
            if (node.data.fullpath !== undefined) {
                this.nodeKeyword = node.data.fullpath;
            }
            const res = await UserApi.getUserGroupList(this.nodeKeyword);
            const rdata = [];
            res.data.forEach(item => {
                rdata.push({
                    text: item.text,
                    leaf: item.leaf,
                    fullpath: item.id
                });
            });
            resolve(rdata);
        },
        // 点击子节点
        handleNodeClick(data) {
            if (data !== undefined) {
                // 防止重複點擊
                if (this.GroupKeyword === data.fullpath) return;
                this.GroupKeyword = data.fullpath;
            }
            this.getAllUserList(this.GroupKeyword);
        },
        // 用户列表 - 请求数据
        async getAllUserList(e) {
            let vm = this,
                page = 1,
                Group = e,
                limit = 1000,
                filter = "";
            if (vm.SearchUserText) filter = vm.SearchUserText;
            const res = await UserApi.getAllUserList(
                page,
                limit,
                Group,
                filter
            );
            if (res.success) {
                if (Group === "Root") {
                    vm.userData = res.data;
                    vm.userGroupData = res.data;
                } else {
                    vm.userGroupData = res.data;
                }
            }
        },
        // 添加用户
        addUserDblclick(e) {
            let arr = this.addUserData;
            let index = arr.findIndex(item => item.text === e.text);
            if (index !== -1) {
                this.$message.error("已有該用戶");
            } else {
                if (this.dialogObj.limitSingle) {
                    this.addUserData = [{
                        text: e.text,
                        id: e.id
                    }]
                } else {
                    this.addUserData.push({
                        text: e.text,
                        id: e.id
                    });
                }
            }


        },
        // 删除用户
        deleteDblclick(e) {
            let vm = this,
                arr = vm.addUserData,
                index = arr.findIndex(item => item.text === e.text);
            if (index !== -1) {
                if (this.dialogObj.buttonTitle !== "创建新消息") {
                    if (index === 0 && this.dialogObj.status === "RecUsers")
                        this.$message.error("不可刪除該用戶");
                    else arr.splice(index, 1);
                } else arr.splice(index, 1);
            }
        },
        // 确定
        addUserHandle() {
            let vm = this;
            let arr = vm.addUserData;
            if (arr.length === 0) {
                vm.editHandle();
            } else {
                let Users = arr.map(item => item.text);
                let UserList = arr.map(item => item.id);
                vm.Users = Users.join(",");
                vm.UserList = UserList.join(",");
                vm.editHandle();
            }
        },
        editHandle() {
            let vm = this;
            vm.$emit("reUser", vm.dialogObj.status, vm.Users, vm.UserList);
            vm.dialogClose();
        },
        // 关闭弹窗
        dialogClose() {
            this.$emit("reData", false);
            this.isFirst = false;
            this.userData = [];
            this.userGroupData = [];
            this.SearchUserText = "";
            this.GroupKeyword = "";
            this.addUserData = [];
            this.Users = "";
            this.UserList = "";
        }
    }
};
</script>
<style lang="scss">
.addUser {
    .el-dialog {
        max-width: 900px;
    }
    .addUser_User {
        .userData {
            width: calc(100% - 30px);
        }
    }
    .addUser_UserGroup {
        .UserGroup {
            width: calc(100% - 30px);
        }
    }
    .AU-search {
        background-color: #f2f1f6;
        padding: 10px 20px 5px;
        border-radius: 7px 7px 0 0;
    }
    .AU-tree {
        border: 2px solid #f2f1f6;
        .filter-tree {
            height: 190px;
            overflow-y: scroll;
        }
    }
    .AU-table {
        border: 2px solid #f2f1f6;
    }
}

.el-tree {
    border: 0;
    .el-tree-node__label {
        position: relative;
        padding-left: 30px;
    }
    // 2020.4.16-4-2
    .el-tree-node__label:before {
        content: "";
        position: absolute;
        background-image: url("../../assets/tree/document_directory.png");
        background-size: 20px;
        top: -3px;
        left: 0;
        z-index: 2;
        width: 20px;
        height: 20px;
    }
    .el-tree-node__content {
        padding: 5px;
    }
}
</style>
