<template>
  <div>
    <el-table
      :data="tableList"
      border
      v-loading="loading"
      :height="tableHeightLocal"
    >
      <el-table-column
        prop="generalArchiveName"
        show-overflow-tooltip
        label="全宗号"
      >
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column>
        <template slot="header">
          <!-- <el-input
            size="mini"
            v-model="searchItem"
            placeholder="输入后按回车进行搜索"
          /> -->
          <el-button type="primary" @click="add">新增</el-button>
        </template>
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" size="mini">修改</el-button>
          <el-button @click="del(scope.row)" type="danger" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      :pagination="pagination"
      @changepage="pageNum2"
      @sizeChange="changeSize"
      :current-page.sync="pageNum"
    />
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="全宗号" prop="num">
          <el-input v-model="form.num" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="6" />
        </el-form-item>
        <el-form-item label="使用情况" v-if="type == '修改'">
          <el-select v-model="form.isUse">
            <el-option
              v-for="(item, index) in useOptions"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NoApi from "@/api/services2/allCaseNo";
export default {
  data() {
    return {
      searchItem: "",

      loading: false,
      dialogVisible: false,
      dialogTitle: "",
      tableList: [],
      pageNum: 1,
      pagination: {
        total: 0,
        pageSize: 10,
      },

      form: {
        num: "",
        remark: "",
        isUse: "",
      },
      useOptions: [
        {
          label: "在用",
          value: 1,
        },
        {
          label: "历史",
          value: 2,
        },
      ],
      time: 0,
      type: "",
      id: "",
      rules: {
        num: [{ required: true, message: "请输入全宗号", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getList();
  },
  watch: {
    time: {
      handler(newValue) {
        if (newValue) {
          this.getList();
        }
      },
    },
  },
  methods: {
    // 获取全宗号列表
    getList() {
      this.loading = true;
      let data = {
        pageSize: this.pagination.pageSize,
        pageNum: this.pageNum,
      };
      NoApi.getNoList(data).then((res) => {
        if (res.code === 200) {
          this.tableList = res.data.list;
        }
        this.loading = false;
      });
    },
    // 删除全宗号
    del(e) {
      let data = {
        id: e.id,
      };
      NoApi.deleteNo(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.time++;
        }
      });
    },
    // 添加全宗号
    add() {
      this.dialogTitle = "添加全宗号";
      this.dialogVisible = true;
      this.type = "添加";
    },
    // 修改全宗号
    edit(e) {
      this.id = e.id;
      this.dialogTitle = "修改全宗号";
      this.type = "修改";
      this.form.isUse = e.isUse;
      this.form.remark = e.remark;
      this.form.num = e.generalArchiveName;
      this.dialogVisible = true;
    },
    cancel() {
      this.dialogVisible = false;
      this.form = {};
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type == "添加") {
            let data = {
              generalArchiveName: this.form.num,
              remark: this.form.remark,
            };
            NoApi.addNo(data).then((res) => {
              if (res.code === 200) {
                this.cancel();
                this.time++;
                this.$message.success("新增全宗号成功");
              }
            });
          }
          if (this.type == "修改") {
            let data = {
              id: this.id,
              generalArchiveName: this.form.num,
              remark: this.form.remark,
              isUse: this.form.isUse,
            };
            NoApi.editNo(data).then((res) => {
              if (res.code === 200) {
                this.cancel();
                this.time++;
                this.$message.success("修改全宗号成功");
              }
            });
          }
        }
      });
    },
    pageNum2(e) {
      this.pageNum = e;
      this.getList();
    },
    changeSize(e) {
      this.pagination.pageSize = e;
      this.getList();
    },
  },
  computed: {
    tableHeightLocal() {
      let height = document.body.clientHeight - 270;
      return height;
    },
  },
};
</script>

<style>
</style>