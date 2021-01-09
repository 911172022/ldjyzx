<template>
  <div>
    <div class="flex-row">
      <el-input
        clearable
        size="small"
        placeholder="输入姓名按回车进行搜索"
        v-model="searchValue"
        prefix-icon="el-icon-search"
        @change="getUserList"
      ></el-input>
      <el-button type="primary" size="small" @click="addNewUser"
        >添加用户</el-button
      >
      <el-button type="primary" size="small" @click="getUserList"
        >刷新列表</el-button
      >
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="userData"
      tooltip-effect="dark"
      :height="tableHeightLocal"
      class="dialogTable"
      border
      highlight-current-row
    >
      <el-table-column prop="account" label="账户名" />
      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="systemAuthority" label="系统权限" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            v-if="!hideTableBtn"
            @click="handleDelete(scope.row)"
            type="text"
            size="small"
            >删除
          </el-button>
          <el-button
            v-if="!hideTableBtn"
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            @click="addDepartment(scope.row, name)"
            v-if="departmentId || groupId"
            type="text"
            size="small"
            >加入{{ name }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pagination="pagination"
      @changepage="handlePageChange"
      @sizeChange="handleSizeChange"
      :current-page.sync="pageNum"
    />
    <!-- 新增，修改用户 -->
    <el-dialog :title="dialogTitle" :visible.sync="userFormOpen" append-to-body width="30%">
      <el-form :model="userForm" :rules="rules" ref="userForm">
        <el-form-item
          label="账户:"
          prop="account"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model.trim="userForm.account"
            autocomplete="off"
            placeholder="请输入账户"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="姓名:"
          prop="username"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model.number="userForm.username"
            autocomplete="off"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="系统使用权限:"
          prop="systemAuthority"
          :label-width="formLabelWidth"
        >
          <el-select
            placeholder="请选择"
            v-model="userForm.systemAuthority"
            style="width: 100%"
          >
            <el-option
              v-for="item in Types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model.trim="userForm.remark"
            autocomplete="off"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelHandle('userForm')">取消</el-button>
        <el-button
          v-if="!isNewUser"
          type="primary"
          @click="submitForm('userForm', 'userSave')"
          >保存</el-button
        >
        <el-button
          v-else
          type="primary"
          @click="submitForm('userForm', 'userAdd')"
          >添加</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { TimeChange } from "../../util/Time";
import UserApi from "@/api/services2/user";

export default {
  props: {
    departmentId: Number,
    groupId: Number,
    name: String,
  },
  data() {
    return {
      userFormOpen: false,
      searchValue: "",
      // 用户列表
      userData: [],
      // 用户表单
      isNewUser: false,
      formLabelWidth: "120px",
      userForm: {},
      Types: [
        {
          value: "1,2",
          label: "全部",
        },
        {
          value: "1",
          label: "管理平台",
        },
        {
          value: "2",
          label: "利用平台",
        },
      ],
      rules: {
        account: [{ required: false, message: "请输入账户", trigger: "blur" }],
        username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        systemAuthority: [
          { required: true, message: "请选择系统使用权限", trigger: "change" },
        ],
      },

      loading: false,
      pageNum: 1,
      pagination: {
        total: 0,
        pageSize: 50,
      },

      dialogTitle: "",
      userId: "",
    };
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 230;
      return height;
    },
    hideTableBtn() {
      let result;
      if (this.groupId || this.departmentId) {
        result = true;
      } else {
        result = false;
      }
      return result;
    },
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 加入选择的单位
    addDepartment(e, name) {
      let data = {
        userId: e.userId,
        departmentId: this.departmentId,
      };
      let data2 = {
        userId: e.userId,
        groupId: this.groupId,
      };
      switch (name) {
        case "单位":
          UserApi.addUserByDepartment(data).then((res) => {
            if (res.code === 200) {
              this.$message.success("加入成功");
            } 
          });
          break;
        case "用户组":
          UserApi.addUserByGroup(data2).then((res) => {
            if (res.code === 200) {
              this.$message.success("加入成功");
            } 
          });
          break;
        default:
          break;
      }
    },
    // 添加用户按钮
    addNewUser() {
      this.userFormOpen = true;
      this.isNewUser = true;
      this.dialogTitle = "添加用户";
    },
    // 删除用户
    handleDelete(e) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          id: e.userId,
        };
        UserApi.deleteUser(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除用户成功");
            this.getUserList();
          } 
        });
      });
    },
    // 编辑用户
    handleEdit(e) {
      this.userFormOpen = true;
      this.isNewUser = false;
      this.dialogTitle = "编辑用户";
      this.userId = e.userId;
      let data = {
        id: e.userId,
      };
      UserApi.getUser(data).then((res) => {
        this.userForm = res.data;
      });
    },
    // 每页显示数量改变
    handleSizeChange(e) {
      this.pagination.pageSize = e;
      this.getUserList();
    },
    // 页码改变
    handlePageChange(e) {
      this.pageNum = e;
      this.getUserList();
    },
    // 用户列表 - 请求数据
    async getUserList() {
      this.loading = true;
      let data = {
        username: this.searchValue,
        pageSize: this.pagination.pageSize,
        pageNum: this.pageNum,
      };
      const res = await UserApi.getUserList(data);
      if (res.code === 200) {
        this.userData = res.data.list;
        this.userData.forEach((item) => {
          switch (item.systemAuthority) {
            case "1":
              return (item.systemAuthority = "管理平台");
            case "2":
              return (item.systemAuthority = "利用平台");
            default:
              return (item.systemAuthority = "全部");
          }
        });
        this.pagination.total = res.data.total;
        this.loading = false;
      } else {
        this.loading = false;
      }
    },
    // 用户弹窗 - 取消按钮
    cancelHandle(formName) {
      let vm = this;
      this.userFormOpen = false;
      vm.$refs[formName].resetFields();
      this.getUserList();
      vm.$emit("reData", false);
    },
    // 用户列表 - 删除
    async deleteUser() {
      let vm = this;
      vm.$message({
        message: "删除成功",
        type: "success",
      });
    },
    // 用户表单 - 保存.添加
    submitForm(formName, e) {
      let vm = this;
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          if (e == "userAdd") {
            let data = {
              account: this.userForm.account,
              remark: this.userForm.remark,
              systemAuthority: this.userForm.systemAuthority,
              username: this.userForm.username,
            };
            UserApi.addUser(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("添加用户成功");
                this.cancelHandle(formName);
              } 
            });
          }
          if (e == "userSave") {
            let data = {
              id: this.userId,
              account: this.userForm.account,
              remark: this.userForm.remark,
              systemAuthority: this.userForm.systemAuthority,
              username: this.userForm.username,
            };
            UserApi.updateUserInfo(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("编辑用户成功");
                this.cancelHandle(formName);
              } 
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss">
.flex-row {
  display: flex;
  padding-bottom: 10px;
  > button {
    margin-left: 10px;
  }
}
</style>
