<template>
  <div>
    <div class="flex-row">
      <el-switch
        style="margin-right: 10px"
        v-model="isAutoBackUp"
        active-text="开启自动备份"
        inactive-text="关闭自动备份"
        @change="changeAuto"
      >
      </el-switch>
      <el-dropdown v-if="isAutoBackUp">
        <el-button type="primary">
          {{ dropDownName ? dropDownName : "自动备份周期"
          }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="autoBackUp(1)"
            >每周</el-dropdown-item
          >
          <el-dropdown-item @click.native="autoBackUp(2)"
            >每月</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" @click="backUp">手动备份</el-button>
    </div>
    <el-table
      border
      v-loading="loading"
      :height="tableHeightLocal+80"
      :data="tableList"
      highlight-current-row
      stripe
    >
      <el-table-column
        max-width="5%"
        min-width="130"
        label="文件名"
        prop="name"
      ></el-table-column>
      <el-table-column
        max-width="5%"
        min-width="130"
        label="备份人"
        prop="creatorName"
      ></el-table-column>
      <el-table-column width="250">
        <template slot-scope="scope">
          <el-button type="primary" @click="replace(scope.row)">恢复</el-button>
          <el-button type="danger" @click="deleteData(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pagination="pagination"
      @changepage="handlePageChange"
      @sizeChange="handleSizeChange"
      :current-page.sync="pageNum"
    />
  </div>
</template>

<script>
import BackUpApi from "@/api/services2/data";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      dropDownName: "",

      isAutoBackUp: false,
      loading: false,
      tableList: [],
      pageNum: 1,
      pagination: {
        total: 0,
        pageSize: 20,
      },
    };
  },
  mounted() {
    this.getList();
    this.getBackUp();
  },
  methods: {
    // 查询系统数据自动备份设置
    getBackUp() {
      BackUpApi.autoBackUp().then((res) => {
        if (res.code === 200) {
          switch (res.data.type) {
            case 1:
              this.dropDownName = "每周自动备份";
              break;
            case 2:
              this.dropDownName = "每月自动备份";
              break;
            default:
              break;
          }
          switch (res.data.status) {
            case 1:
              this.isAutoBackUp = true;
              break;
            case 2:
              this.isAutoBackUp = false;
              break;
            default:
              break;
          }
        }
      });
    },
    getList() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pagination.pageSize,
      };
      this.loading = true;
      BackUpApi.getBackUpList(data).then((res) => {
        if (res.code === 200) {
          this.tableList = res.data.list;
          this.pagination.total = res.data.total;
        }
        this.loading = false;
      });
    },
    // 删除备份
    deleteData(e) {
      this.$confirm("此操作将永久删除该备份, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          id: e.id,
        };
        BackUpApi.deleteBackUp(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          }
        });
      });
    },
    // 手动备份
    backUp(e) {
      this.$confirm("请确定是否进行手动备份", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        BackUpApi.run().then((res) => {
          if (res.code === 200) {
            this.$message.success("手动备份成功");
            this.getList();
          }
        });
      });
    },
    // 恢复备份
    replace(e) {
      this.$confirm("请确定是否恢复", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          id: e.id,
        };
        BackUpApi.restore(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "恢复成功!",
            });
            this.getList();
          }
        });
      });
    },
    // 每页显示数量改变
    handleSizeChange(e) {
      this.pagination.pageSize = e;
      this.getList();
    },
    // 页码改变
    handlePageChange(e) {
      this.pageNum = e;
      this.getList();
    },
    autoBackUp(e) {
      this.$confirm("请确定修改自动备份周期", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          expressionType: e,
        };
        BackUpApi.updateExpressionType(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "修改自动备份周期成功!",
            });
            this.getBackUp();
          }
        });
      });
    },
    changeAuto(e) {
      let status;
      e ? (status = 1) : (status = 2);
      let data = {
        status: status,
      };
      BackUpApi.openStatus(data).then((res) => {
        if (res.code === 200) {
          if (status == 1) {
            this.$message.success("开启自动备份成功，请选择自动备份周期");
          }
          if (status == 2) {
            this.$message.success("关闭自动备份成功");
          }
        }
      });
    },
  },
  computed: {
    ...mapGetters("doc",["tableHeightLocal"])
  },
};
</script>

<style scoped>
.flex-row {
  align-items: center;
  justify-content: start;
}
</style>