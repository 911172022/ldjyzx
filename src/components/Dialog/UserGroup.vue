<template>
  <div>
    <div class="btn-box">
      <el-button type="primary" @click="openDialog('add')" size="small"
        >新建用户组</el-button
      >
      <el-button type="primary" @click="openDialog('update')" size="small"
        >编辑用户组</el-button
      >
      <el-button type="primary" @click="OpenDeleteHandle" size="small"
        >删除用户组</el-button
      >
      <el-button type="primary" @click="addUserToDept" size="small"
        >添加成员</el-button
      >
    </div>
    <div class="copyModule">
      <div style="overflow: hidden" class="flex-row">
        <div class="UG-tree">
          <!-- <div class="UG-search">
            <el-input
              placeholder="搜索用户"
              v-model="searchValue"
              prefix-icon="el-icon-search"
            ></el-input>
          </div> -->
          <el-tree
            highlight-current
            class="UG-tree-filter Common-Tree-Icon"
            :data="treeData"
            :props="props"
            v-loading="treeLoading"
            @node-click="treeClick"
            node-key="groupId"
            :default-expanded-keys="[2]"
            :render-content="renderContent"
            @node-contextmenu="contextMenuClickTest"
          ></el-tree>
        </div>
        <div class="UG-table" style="flex: 1">
          <el-table
            v-loading="tableLoading"
            :data="userList"
            :height="tableHeightLocal"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="account" label="账号"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="handleDelete(scope.row)"
                  type="text"
                  size="small"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div
      v-if="menuVisible"
      class="rightMenu"
      ref="rightMenu"
      :style="styleObject"
    >
      <ul class="rightMenu-ul">
        <li
          v-for="(item, index) in MenuListFilter"
          :key="index"
          class="rightMenu-li"
          :class="item.State === 'Enabled' ? '' : 'RM-disabled'"
          @click="getMenuRight(item)"
        >
          {{ item.Name }}
        </li>
      </ul>
    </div>

    <el-dialog
      width="50%"
      class="width-25"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      :before-close="resetForm"
      append-to-body
    >
      <el-form :model="NewUserGroupForm" :rules="rules" ref="NewUserGroupForm">
        <el-form-item>
          <el-checkbox v-model="checked">是否设为一级目录</el-checkbox>
        </el-form-item>
        <el-form-item label="用户组名称" prop="name">
          <el-input v-model.trim="NewUserGroupForm.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="!isUpdate"
          type="primary"
          @click="NewUserGroup('NewUserGroupForm', 'add')"
          >提交</el-button
        >
        <el-button
          v-else
          type="primary"
          @click="NewUserGroup('NewUserGroupForm', 'update')"
          >提交</el-button
        >
        <el-button @click="resetForm">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="90%"
      title="添加成员"
      :visible.sync="userVisible"
      append-to-body
      :before-close="handleClose"
    >
      <User :groupId="departmentId" name="用户组" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">提交</el-button>
        <el-button @click="userVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UserApi from "../../api/services2/user";
// import { Doc_TreeIconChange } from "@/util/Common";

export default {
  data() {
    return {
      searchValue: "",
      dialogTitle: "",
      departmentId: "",

      checked: false,
      treeLoading: false,
      tableLoading: false,
      isTreeClick: false, //点击了目录树才显示这个按钮

      treeData: [],
      props: {
        children: "list",
        label: "name",
        isLeaf: "leaf",
      },
      userList: [],
      isUpdate: false,

      // 新建用戶組
      innerVisible: false,
      userVisible: false,
      NewUserGroupForm: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入用户组名称", trigger: "blur" },
        ],
      },
      menuVisible: false,
      styleObject: {
        top: 0,
        left: 0,
        opacity: 0,
        position: "fixed",
      },
    };
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 170;
      return height;
    },
  },
  mounted() {
    this.getGroupList();
  },
  methods: {
    getMenuRight(e) {
      switch (e.Name) {
        case "新建用户组":
          this.openDialog("add");
          break;
        case "删除用户组":
          this.OpenDeleteHandle();
          break;
        case "编辑用户组":
          this.openDialog("update");
          break;
        case "添加成员":
          this.addUserToDept();
          break;
        default:
          break;
      }
    },
    // 取消右键
    foo() {
      // 取消鼠标监听事件
      let vm = this;
      vm.menuVisible = false;
      vm.styleObject.opacity = 0;
      vm.styleObject.top = 0;
      vm.styleObject.left = 0;
      document.removeEventListener("mousedown", vm.foo);
    },
    // 右键功能
    contextMenuClickTest(MouseEvent, object, Node) {
      let vm = this;
      this.menuVisible = false;
      this.menuVisible = true;
      this.treeClick(object);
      this.MenuListFilter = [
        {
          Name: "新建用户组",
          State: "Enabled",
          categoryId: object.categoryId,
        },
        {
          Name: "删除用户组",
          State: "Enabled",
          categoryId: object.categoryId,
        },
        {
          Name: "编辑用户组",
          State: "Enabled",
          categoryId: object.categoryId,
        },
        {
          Name: "添加成员",
          State: "Enabled",
          categoryId: object.categoryId,
        },
      ];
      vm.len = this.MenuListFilter.length * 33;
      vm.styleObject.opacity = 1;

      // 窗口高度
      let windowHeight = document.body.clientHeight;
      // 窗口宽度
      // let windowWidth = document.body.clientWidth

      if (this.MenuListFilter.length === 1) {
        vm.styleObject.top = MouseEvent.clientY - 80 + "px";
        vm.styleObject.left = MouseEvent.clientX + 30 + "px";
      } else {
        // 要注意视窗高度和鼠标点击的y是否能完全容纳menu
        if (windowHeight - MouseEvent.clientY > this.len) {
          this.styleObject.top = MouseEvent.clientY + "px";
        } else {
          this.styleObject.top =
            MouseEvent.clientY -
            (this.len - (windowHeight - MouseEvent.clientY)) +
            "px";
        }

        vm.styleObject.left = MouseEvent.clientX + 30 + "px";
      }
      document.addEventListener("click", vm.foo);
    },
    handleClose() {
      this.userVisible = false;
      this.getUserByGroup();
    },
    resetForm() {
      this.$refs["NewUserGroupForm"].resetFields();
      this.innerVisible = false;
    },
    addUserToDept() {
      this.userVisible = true;
    },
    // 点击用户组获取用户列表
    treeClick(e) {
      this.departmentId = e.groupId;
      this.getUserByGroup();
    },
    getUserByGroup() {
      this.tableLoading = true;
      let data = {
        groupId: this.departmentId,
      };
      UserApi.getGroupUserList(data).then((res) => {
        if (res.code === 200) {
          this.userList = res.data;
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
    },
    // 获取用户组树列表
    getGroupList() {
      this.treeLoading = true;
      UserApi.getGroupList().then((res) => {
        if (res.code === 200) {
          this.treeData = res.data;
          this.treeLoading = false;
          this.getUserByGroup();
        } else {
          this.treeLoading = false;
        }
      });
    },
    // 新建用户组
    NewUserGroup(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type == "add") {
            if (this.checked) {
              this.departmentId = "";
            }
            let data = {
              parentId: this.departmentId,
              name: this.NewUserGroupForm.name,
            };
            UserApi.addGroup(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("新增用户组成功");
                this.NewUserGroupForm.name = "";
                this.innerVisible = false;
                this.getGroupList();
              } else {
                this.$message.success("新增用户组失败,", res.message);
              }
            });
          } else {
            let data = {
              name: this.NewUserGroupForm.name,
              groupId: this.departmentId,
            };
            UserApi.updateGroup(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("修改用户组成功");
                this.NewUserGroupForm.name = "";
                this.innerVisible = false;
                this.getGroupList();
              } else {
                this.$message.success("修改用户组失败,", res.message);
              }
            });
          }
        }
      });
    },
    // 删除用户组
    OpenDeleteHandle(e) {
      console.log(e)
      let vm = this;
      if (!vm.departmentId) return vm.prompt("請选择用户组", "error");
      this.$confirm("此操作将永久删除该用户组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          id: this.departmentId,
        };
        UserApi.deleteGroup(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getGroupList();
          }
        });
      });
    },
    // 删除用户组内的用户
    handleDelete(e) {
      this.$confirm("此操作将把用户从该用户组剔除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          groupId: this.departmentId,
          userId: e.userId,
        };
        UserApi.deleteUserByGroup(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getUserByGroup();
          }
        });
      });
    },
    // 修改用户组信息
    openDialog(e) {
      this.innerVisible = true;
      if (e == "add") {
        this.dialogTitle = "新建用户组";
        this.isUpdate = false;
      } else {
        this.dialogTitle = "编辑用户组";
        this.isUpdate = true;
      }
    },

    // 提示
    prompt(message, type) {
      this.$message({ message, type });
    },
    renderContent(h, { node }) {
      let style = `padding-left: 5px;`;
      return (
        <span class="tree_row">
          <span></span>
          <span style={style}>{node.label}</span>
        </span>
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-box {
  padding-bottom: 10px;
  > button {
    margin: 0 10px;
  }
}
.UG-search {
  background-color: #f2f1f6;
  padding: 10px 20px 5px;
  border-radius: 7px 7px 0 0;
}
.UG-tree {
  border: 2px solid #f2f1f6;
  .UG-tree-filter {
    width: 250px;
    height: calc(100% - 60px);
    overflow-y: auto;
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
</style>

<style scoped>
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