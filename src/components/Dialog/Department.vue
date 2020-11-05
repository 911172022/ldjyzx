<template>
  <div>
    <div class="btn-box">
      <!-- <div class="btn-box" v-if="isTreeClick"> -->
      <el-dropdown @command="handleCommand">
        <el-button type="primary">
          单位操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">新建单位</el-dropdown-item>
          <el-dropdown-item command="delete">删除单位</el-dropdown-item>
          <el-dropdown-item command="update">编辑单位</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" v-if="isTreeClick" @click="addUserToDept">添加成员</el-button>
    </div>
    <div class="copyModule">
      <div style="overflow: hidden" class="flex-row">
        <div class="UG-tree">
          <!-- <div class="UG-search">
            <el-input
              placeholder="搜索用户"
              v-model="OldFilterText"
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
            node-key="departmentId"
            :default-expanded-keys="[1]"
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

    <el-dialog
      width="90%"
      class="width-25"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      :before-close="resetForm"
      append-to-body
    >
      <el-form :model="NewUserGroupForm" :rules="rules" ref="NewUserGroupForm">
        <el-form-item>
          <el-checkbox v-model="checked">是否设为一级分类</el-checkbox>
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
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
      <User :departmentId="departmentId" name="单位" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">提交</el-button>
        <el-button @click="userVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UserApi from "../../api/services2/user";
import UserApi2 from "../../api/services/group";
import { Doc_TreeIconChange } from "@/util/Common";

export default {
  data() {
    return {
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

      OldFilterText: "",
      NewFilterText: "",
      TimeId: -1,
      isLoaingUser: true,
      isLoaingGroup: true,
      // 组织机构
      // 舊用戶組列表
      OldnodeKeyword: "Root",
      OldgroupKeyword: "",
      OldUserGroupText: "",
      // 舊用戶列表
      OlduserKeyword: "",

      // 新用戶組列表
      NewnodeKeyword: "Root",
      NewgroupKeyword: "",
      NewUserGroupText: "",
      NewUserGroupChildren: {},
      // 新用戶列表
      NewUserList: [],
      userKeyword: "",

      // 新建用戶組
      innerVisible: false,
      userVisible: false,
      NewUserGroupForm: {
        name: "",
      },
      rules: {
        name: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
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
    this.getDepartmentList();
  },
  methods: {
    handleClose() {
      this.userVisible = false;
      this.getUserByDepartment();
    },
    resetForm() {
      this.$refs["NewUserGroupForm"].resetFields();
      this.innerVisible = false;
    },
    addUserToDept() {
      this.userVisible = true;
    },
    // 单位操作的下拉
    handleCommand(e) {
      switch (e) {
        case "add":
          this.openDialog("add");
          break;
        case "delete":
          this.OpenDeleteHandle();
          break;
        case "update":
          this.openDialog("update");
          break;
        default:
          break;
      }
    },
    // 点击单位获取用户列表
    treeClick(e) {
      this.isTreeClick = true;
      this.departmentId = e.departmentId;
      this.getUserByDepartment();
    },
    // 获取单位下的用户
    getUserByDepartment() {
      this.tableLoading = true;
      let data = {
        departmentId: this.departmentId,
      };
      UserApi.getDepartmentUserList(data).then((res) => {
        if (res.code === 200) {
          this.userList = res.data;
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
          this.$message.error("获取用户列表失败,", res.message);
        }
      });
    },
    // 获取单位树列表
    getDepartmentList() {
      this.treeLoading = true;
      UserApi.getDepartmentList().then((res) => {
        if (res.code === 200) {
          this.treeData = res.data;
          this.treeLoading = false;
          this.getUserByDepartment();
        } else {
          this.treeLoading = false;
          this.$message.error("获取用户组信息失败,", res.message);
        }
      });
    },
    // 新建单位
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
            UserApi.addDepartment(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("新增单位成功");
                this.NewUserGroupForm.name = "";
                this.innerVisible = false;
                this.getDepartmentList();
              } else {
                this.$message.success("新增单位失败,", res.message);
              }
            });
          } else {
            let data = {
              name: this.NewUserGroupForm.name,
              departmentId: this.departmentId,
            };
            UserApi.updateDepartment(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("修改单位成功");
                this.NewUserGroupForm.name = "";
                this.innerVisible = false;
                this.getDepartmentList();
              } else {
                this.$message.success("修改单位失败,", res.message);
              }
            });
          }
        }
      });
    },
    // 删除单位
    OpenDeleteHandle(e) {
      let vm = this;
      if (!vm.departmentId) return vm.prompt("請选择单位", "error");
      this.$confirm("此操作将永久删除该单位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          id: this.departmentId,
        };
        UserApi.deleteDepartment(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getDepartmentList();
          } else {
            this.$message.error("删除失败,", res.message);
          }
        });
      });
    },
    // 删除单位内的用户
    handleDelete(e) {
      this.$confirm("此操作将把用户从该单位剔除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          departmentId: this.departmentId,
          userId: e.userId,
        };
        UserApi.deleteUserByDepartment(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getUserByDepartment();
          } else {
            this.$message.error("删除失败,", res.message);
          }
        });
      });
    },
    // 修改单位信息
    openDialog(e) {
      this.innerVisible = true;
      if (e == "add") {
        this.dialogTitle = "新建单位";
        this.isUpdate = false;
      } else {
        this.dialogTitle = "编辑单位";
        this.isUpdate = true;
      }
    },

    // 提示
    prompt(message, type) {
      this.$message({ message, type });
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