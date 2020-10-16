<template>
  <el-dialog
    title="用户组设置"
    class="userGroupSetting width-70"
    :visible.sync="dialogObj.switch"
    width="90%"
    @before-close="dialogClose"
  >
    <div class="copyModule">
      <div style="overflow: hidden" class="flex-row">
        <div class="UG-tree">
          <div class="UG-search">
            <el-input
              placeholder="搜索用户"
              v-model="OldFilterText"
              prefix-icon="el-icon-search"
            ></el-input>
          </div>
          <el-tree
            highlight-current
            class="UG-tree-filter Common-Tree-Icon"
            :data="data"
            :props="props"
            @node-click="treeClick"
          ></el-tree>
          <!-- <el-tree
            class="UG-tree-filter Common-Tree-Icon"
            :load="OldloadNode"
            lazy
            :props="props"
            highlight-current
            ref="OldUserGroupList"
            @node-click="OldhandleNodeClick"
            node-key="text"
            :default-expanded-keys="DefaultNode"
          >
            <template slot-scope="{ node }">
              <span>
                <span class="icon"></span>
                <span style="padding-left: 5px">{{ node.label }}</span>
              </span>
            </template>
          </el-tree> -->
        </div>
        <div class="UG-table">
          <el-table
            :data="OldUserList"
            highlight-current-row
            @row-click="OldhandleCurrentChange"
            style="width: 100%"
          >
            <el-table-column prop="text" label="用户"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="innerVisible = true"
        >新建用户组</el-button
      >
      <el-button size="small" @click="OpenDeleteHandle('group')"
        >删除用户组</el-button
      >
      <el-button size="small" @click="OpenDeleteHandle('user')"
        >删除组的用户</el-button
      >
      <el-button size="small" @click="dialogClose">取消</el-button>
    </span>
    <el-dialog
      width="90%"
      class="width-25"
      title="新建用戶組"
      :visible.sync="innerVisible"
      :before-close="resetForm"
      append-to-body
    >
      <el-form
        :model="NewUserGroupForm"
        :rules="rules"
        ref="NewUserGroupForm"
        :label-width="formLabelWidth"
      >
        <el-form-item label="代碼" prop="groupCode">
          <el-input
            v-model.trim="NewUserGroupForm.groupCode"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="描述" prop="groupDesc">
          <el-input
            v-model.trim="NewUserGroupForm.groupDesc"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="NewUserGroup('NewUserGroupForm')"
          >确定</el-button
        >
        <el-button @click="resetForm">取消</el-button>
      </div>
    </el-dialog>
    <!-- 删除彈窗 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteVisible"
      width="90%"
      class="width-25"
      append-to-body
    >
      <span>是否刪除選中項?</span>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="isDelete === 'user'" type="primary" @click="DeleteUser"
          >确定</el-button
        >
        <el-button v-else type="primary" @click="DeleteUserGroup"
          >确定</el-button
        >
        <el-button @click="deleteVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
import UserApi from "../../api/services/user";
import UserApi2 from "../../api/services/group";
import { Doc_TreeIconChange } from "@/util/Common";

export default {
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: function () {
        return {
          switch: false,
        };
      },
    },
  },
  data() {
    return {
      // 原型文件
      data: [
        {
          text: "劳动就业中心",
          value: "1",
          children: [
            {
              text: "综合部",
              value: "2",
            },
            {
              text: "技术部",
              value: "3",
            },
            {
              text: "生产部",
              value: "4",
            },
          ],
        },
      ],
      // 默认展开的节点
      DefaultNode: ["所有组织架构"],
      OldFilterText: "",
      NewFilterText: "",
      TimeId: -1,
      isLoaingUser: true,
      isLoaingGroup: true,
      // 组织机构
      props: {
        label: "text",
        isLeaf: "leaf",
      },
      // 舊用戶組列表
      OldnodeKeyword: "Root",
      OldgroupKeyword: "",
      OldUserGroupText: "",
      // 舊用戶列表
      OldUserList: [],
      OlduserKeyword: "",

      // 新用戶組列表
      NewnodeKeyword: "Root",
      NewgroupKeyword: "",
      NewUserGroupText: "",
      NewUserGroupChildren: {},
      // 新用戶列表
      NewUserList: [],
      userKeyword: "",

      // 開啟删除彈窗
      deleteVisible: false,
      isDelete: null,
      // 新建用戶組
      innerVisible: false,
      NewUserGroupForm: {
        groupCode: "",
        groupDesc: "",
      },
      formLabelWidth: "80px",
      rules: {
        groupCode: [{ required: true, message: "请输入代码", trigger: "blur" }],
      },
    };
  },
  watch: {
    NewFilterText() {
      clearTimeout(this.TimeId);
      this.TimeId = setTimeout(() => {
        this.NewgetAllUserList();
      }, 500);
    },
    OldFilterText() {
      clearTimeout(this.TimeId);
      this.TimeId = setTimeout(() => {
        this.OldgetAllUserList();
      }, 500);
    },
  },
  methods: {
    // 切换目录树图标
    TreeIconChange(isleaf) {
      return Doc_TreeIconChange(isleaf);
    },
    async NewloadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ text: "所有组织架构" }]);
      }

      if (node.data.fullpath !== undefined) {
        this.NewnodeKeyword = node.data.fullpath;
      }

      let res;
      let rdata = [];
      // 有时候莫名其妙的res为空
      let retry = 5;
      while (retry > 0) {
        retry--;
        res = await UserApi.getUserGroupList(this.NewnodeKeyword);
        if (res.data) {
          break;
        }
      }

      if (!res.data) {
        resolve([]);
        return;
      }

      res.data.forEach((item) => {
        rdata.push({
          text: item.text,
          leaf: item.leaf,
          fullpath: item.id,
        });
      });
      resolve(rdata);
    },
    async OldloadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ text: "所有组织架构" }]);
      }
      if (node.data.fullpath !== undefined) {
        this.OldnodeKeyword = node.data.fullpath;
      }
      const res = await UserApi.getUserGroupList(this.OldnodeKeyword);
      const rdata = [];
      res.data.forEach((item) => {
        rdata.push({
          text: item.text,
          leaf: item.leaf,
          fullpath: item.id,
        });
      });
      resolve(rdata);
    },
    // 單選新用戶組
    async NewhandleNodeClick(data, children) {
      this.NewUserGroupChildren = children;
      if (data !== undefined) {
        // 防止重複點擊
        if (this.NewgroupKeyword === data.fullpath) return;
        this.NewgroupKeyword = data.fullpath;
        this.NewUserGroupText = data.text;
      }
      this.NewgetAllUserList();
    },
    async NewgetAllUserList() {
      let page = 1,
        Group = this.NewgroupKeyword,
        limit = 1000,
        filter = "";
      if (this.NewFilterText) {
        filter = this.NewFilterText;
      }
      const res = await UserApi.getAllUserList(page, limit, Group, filter);
      this.NewUserList = res.data;
    },
    // 單選舊用戶組
    async OldhandleNodeClick(data) {
      // 防止重複點擊
      if (this.OldgroupKeyword === data.fullpath) return;
      this.OldUserGroupText = data.text;
      this.OldgroupKeyword = data.fullpath;
      this.OldgetAllUserList();
    },
    async OldgetAllUserList() {
      let page = 1,
        Group = this.OldgroupKeyword,
        limit = 1000,
        filter = "";
      if (this.OldFilterText) {
        filter = this.OldFilterText;
      }
      const res = await UserApi.getAllUserList(page, limit, Group, filter);
      this.OldUserList = res.data;
    },
    // 點擊用戶獲取 userKeyword
    NewhandleCurrentChange(val) {
      this.userKeyword = val.id;
    },
    // 點擊用戶獲取 OlduserKeyword
    OldhandleCurrentChange(val) {
      this.OlduserKeyword = val.id;
    },
    // 添加用戶
    async AddUser() {
      let vm = this;
      vm.isLoaingUser = false;
      if (!vm.OlduserKeyword) {
        setTimeout(() => {
          vm.isLoaingUser = true;
        }, 250);
        return vm.prompt("請選擇目標用戶", "error");
      }
      const res = await UserApi2.addUser(vm.NewgroupKeyword, vm.OlduserKeyword);
      if (res.success) {
        vm.prompt("添加成功", "success");
        setTimeout(() => {
          vm.isLoaingUser = true;
        }, 250);
        vm.NewhandleNodeClick();
      } else {
        vm.prompt(res.msg, "error");
        setTimeout(() => {
          vm.isLoaingUser = true;
        }, 250);
      }
    },
    // 添加用戶組
    async AddUserGroup() {
      let vm = this;
      // vm.isLoaingGroup = false;
      // if (!vm.OldUserGroupText) {
      //   setTimeout(() => {
      //     vm.isLoaingGroup = true;
      //   }, 250);
      //   return vm.prompt("請選擇目標用戶組", "error");
      // }
      // let arrText = vm.OldUserGroupText.split("__");
      // for (let i = 2; i < 100; i++) {
      //   let groupCode = `${arrText[0]}(${i})`,
      //     groupDesc = arrText[1],
      //     parentGroup = vm.NewgroupKeyword;
      //   if (!groupDesc) groupDesc = "";
      //   const res = await UserApi2.newGroup(groupCode, groupDesc, parentGroup);
      //   if (res.success) {
      //     let data = {};
      //     data.fullpath = res.data[0].groupKeyword;
      //     data.text = res.data[0].groupName;
      //     data.leaf = false;
      //     // 強制改變 isLeaf 為 false
      //     this.$set(this.NewUserGroupChildren, "isLeafByUser", false);
      //     vm.$refs.NewUserGroupList.append(data, vm.NewUserGroupText);
      //     // 添加用戶組裡的用戶
      //     vm.OldUserList.forEach((item) => {
      //       UserApi2.addUser(data.fullpath, item.id).then(() => {});
      //     });
      //     vm.prompt("添加成功", "success");
      //     setTimeout(() => {
      //       vm.isLoaingGroup = true;
      //     }, 250);
      //     return;
      //   }
      // }
    },

    // 開啟删除彈窗
    OpenDeleteHandle(e) {
      let vm = this;
      if (e === "user") {
        if (!vm.userKeyword) return vm.prompt("請選擇用戶", "error");
      } else if (e === "group") {
        if (!vm.NewgroupKeyword) return vm.prompt("請選擇用戶組", "error");
      }
      vm.isDelete = e;
      vm.deleteVisible = true;
    },
    // 删除组的用户 - 确定
    async DeleteUser() {
      let vm = this;
      const res = await UserApi2.dropUser(vm.NewgroupKeyword, vm.userKeyword);
      if (res.success) {
        vm.prompt("删除成功", "success");
        vm.userKeyword = "";
        vm.NewhandleNodeClick();
      }
      vm.deleteVisible = false;
      vm.isDelete = null;
    },
    // 删除用户组 - 确定
    async DeleteUserGroup() {
      let vm = this;
      const res = await UserApi2.dropGroup(vm.NewgroupKeyword);
      if (res.success) {
        vm.prompt("删除成功", "success");
        // 删除子节点
        vm.$refs.NewUserGroupList.remove(vm.NewUserGroupText);
        vm.NewgroupKeyword = "";
      }
      vm.deleteVisible = false;
      vm.isDelete = null;
    },
    // 新建用戶組 - 确定
    NewUserGroup(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newGroup();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新建用戶組 - 取消
    resetForm() {
      this.$refs["NewUserGroupForm"].resetFields();
      this.innerVisible = false;
    },
    // 新建用戶組 - 新建請求
    async newGroup() {
      let vm = this;
      let groupCode = vm.NewUserGroupForm.groupCode,
        groupDesc = vm.NewUserGroupForm.groupDesc,
        parentGroup = "";
      if (vm.NewgroupKeyword) {
        parentGroup = vm.NewgroupKeyword;
      } else {
        parentGroup = "Root";
      }

      const res = await UserApi2.newGroup(groupCode, groupDesc, parentGroup);
      if (res.success) {
        let data = {};
        data.fullpath = res.data[0].groupKeyword;
        data.text = res.data[0].groupName;
        data.leaf = false;
        // 強制改變 isLeaf 為 false
        this.$set(this.NewUserGroupChildren, "isLeafByUser", false);
        vm.$refs.NewUserGroupList.append(data, vm.NewUserGroupText);
        vm.$message({ message: "添加成功", type: "success" });
        this.resetForm();
      } else {
        vm.$message({ message: res.msg, type: "error" });
      }
    },
    // 关闭弹窗
    dialogClose() {
      this.$emit("reData", false);
    },
    // 提示
    prompt(message, type) {
      this.$message({ message, type });
    },

    // 原型代码
    treeClick(e) {
      console.log(e);
      switch (e.value) {
        case "2":
          this.OldUserList = [{ text: "古龙" }, { text: "冰心" }];
          break;
        case "3":
          this.OldUserList = [{ text: "张三" }, { text: "李四" }];
          break;
        case "4":
          this.OldUserList = [{ text: "王五" }, { text: "金庸" }];
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss">
.userGroupSetting {
  .UG-search {
    background-color: #f2f1f6;
    padding: 10px 20px 5px;
    border-radius: 7px 7px 0 0;
  }
  .UG-tree {
    border: 2px solid #f2f1f6;
    .UG-tree-filter {
      height: 600px;
      overflow-y: scroll;
    }
  }
  .UG-table {
    width: 100%;
    border: 2px solid #f2f1f6;
  }
  .transferBtn {
    i {
      display: block;
      margin-bottom: 10px;
      font-size: 40px;
    }
  }
}
</style>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
}
.btn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 10px;
}
.btn-wrapper .MainBtn {
  margin-bottom: 20px;
}
.btn-wrapper .MainBtn:nth-child(-n + 2) i {
  font-size: 40px;
}
</style>