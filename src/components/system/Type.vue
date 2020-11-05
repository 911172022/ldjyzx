<template>
  <div>
    <!-- <div class="btn-box" v-if="isTreeClick"> -->
    <div class="btn-box">
      <el-dropdown @command="handleCommand">
        <el-button type="primary">
          分类操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">新建分类</el-dropdown-item>
          <el-dropdown-item command="delete">删除分类</el-dropdown-item>
          <el-dropdown-item command="update">编辑分类</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="copyModule">
      <div style="overflow: hidden" class="flex-row">
        <div class="UG-tree">
          <!-- <div class="UG-search">
            <el-input
              placeholder="搜索分类"
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
            node-key="categoryId"
            :default-expanded-keys="[1]"
          ></el-tree>
        </div>
        <div class="UG-table" style="flex: 1">
          <div class="top">
            <div class="table-title">固定字段</div>
            <el-table
              v-loading="tableLoading"
              :data="userList"
              highlight-current-row
              style="width: 100%; height: calc(60vh - 210px)"
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
          <div class="bottom">
            <div class="table-title">自定义字段</div>
            <el-table
              v-loading="tableLoading"
              :data="userList"
              highlight-current-row
              style="width: 100%; height: calc(60vh - 210px)"
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
    </div>

    <el-dialog
      width="90%"
      class="width-25"
      :title="dialogTitle"
      :visible.sync="innerVisible"
      :before-close="resetForm"
      append-to-body
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item>
          <el-checkbox v-model="checked">是否设为一级分类</el-checkbox>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model.trim="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="!isUpdate" label="档案类别" prop="archType">
          <el-select v-model="form.archType" :disabled="!checked" placeholder="请选择">
            <el-option
              v-for="item in archTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isUpdate" label="顺序" prop="orderNum">
          <el-input
            v-model.number="form.orderNum"
            placeholder="请输入"
            autocomplete="off"
          />
          <div>提示:数字顺序从1开始,数字越小排名越前</div>
        </el-form-item>
        <!--  <el-form-item label="分类名称" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="!isUpdate"
          type="primary"
          @click="NewType('form', 'add')"
          >提交</el-button
        >
        <el-button v-else type="primary" @click="NewType('form', 'update')"
          >提交</el-button
        >
        <el-button @click="resetForm">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SystemApi from "../../api/services2/system";

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
      form: {
        name: "",
        type: "",
        orderNum: "1",
        archType: "",
      },
      archTypeOptions: [
        {
          label: "未归",
          value: "0",
        },
        {
          label: "案卷",
          value: "1",
        },
        {
          label: "归档",
          value: "2",
        },
        {
          label: "资料",
          value: "3",
        },
      ],
      typeOptions: [
        {
          label: "目录",
          value: "0",
        },
        {
          label: "档案类别",
          value: "1",
        },
      ],
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        archType: [
          { required: true, message: "请选择档案类别", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 190;
      return height;
    },
  },
  mounted() {
    this.getTypeTreeList();
  },
  methods: {
    resetForm() {
      this.$refs["form"].resetFields();
      this.innerVisible = false;
    },
    // 分类操作的下拉
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
    // 点击树状分类获取分类列表
    treeClick(e) {
      this.isTreeClick = true;
      this.form.archType = e.archType.toString();
      this.departmentId = e.categoryId;
    },
    // 查看类型下的属性
    getTypeProperty() {
      this.tableLoading = true;
      let data = {
        name: "",
        parentId: this.departmentId,
      };
      SystemApi.getTypeProperty().then((res) => {
        if (res.code === 200) {
          this.tableLoading = false;
          this.userList = res.data;
        } else {
          this.tableLoading = false;
          this.$message.error(res.message);
        }
      });
    },
    // 获取分类树列表
    getTypeTreeList() {
      this.treeLoading = true;
      SystemApi.getTypeTreeList().then((res) => {
        if (res.code === 200) {
          this.treeData = res.data.map((item) => {
            let archType = this.filterArchType(item.archType);
            return {
              categoryId: item.categoryId,
              name: `${item.name}(${archType})`,
              list: item.list,
            };
          });
          this.treeLoading = false;
        } else {
          this.treeLoading = false;
          this.$message.error("获取分类信息失败,", res.message);
        }
      });
    },
    // 新建分类
    NewType(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.checked) {
            this.departmentId = "";
          }
          if (type == "add") {
            let data = {
              parentId: this.departmentId,
              name: this.form.name,
              archType: this.form.archType,
              orderNum: this.form.orderNum,
              type: 1,
            };
            SystemApi.addType(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("新增分类成功");
                this.$refs[formName].resetFields();
                this.innerVisible = false;
                this.getTypeTreeList();
              } else {
                this.$message.success("新增分类失败,", res.message);
              }
            });
          } else {
            let data = {
              name: this.form.name,
              categoryId: this.departmentId,
            };
            SystemApi.updateType(data).then((res) => {
              if (res.code === 200) {
                this.$message.success("修改分类成功");
                this.$refs[formName].resetFields();
                this.innerVisible = false;
                this.getTypeTreeList();
              } else {
                this.$message.success("修改分类失败,", res.message);
              }
            });
          }
        }
      });
    },
    // 删除分类
    OpenDeleteHandle(e) {
      let vm = this;
      if (!vm.departmentId) return vm.prompt("請选择分类", "error");
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          categoryId: vm.departmentId,
        };
        SystemApi.deleteType(data).then((res) => {
          if (res.code === 200) {
            vm.$message.success("删除成功");
            vm.getTypeTreeList();
          } else {
            vm.$message.error("删除失败,", res.message);
          }
        });
      });
    },
    // 删除分类内的分类
    handleDelete(e) {
      this.$confirm("此操作将把分类从该分类剔除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          categoryId: this.departmentId,
          userId: e.userId,
        };
        SystemApi.deleteUserByGroup(data).then((res) => {
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getTypeTreeList();
          } else {
            this.$message.error("删除失败,", res.message);
          }
        });
      });
    },
    // 修改分类信息
    openDialog(e) {
      this.innerVisible = true;
      if (e == "add") {
        this.dialogTitle = "新建分类";
        this.isUpdate = false;
      } else {
        this.dialogTitle = "编辑分类";
        this.isUpdate = true;
      }
    },
    // 提示
    prompt(message, type) {
      this.$message({ message, type });
    },
    filterArchType(e) {
      switch (e) {
        case 0:
          return (e = "未归");
        case 1:
          return (e = "案卷");
        case 2:
          return (e = "归档");
        case 3:
          return (e = "资料");
        default:
          break;
      }
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
  .table-title {
    font-size: 16px;
    padding: 5px;
    border-bottom: 1px solid #f2f1f6;
  }
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