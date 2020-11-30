<template>
  <div class="asideR">
    <el-form :model="form" inline>
      <el-form-item label="操作类型">
        <el-select size="small" v-model="form.type">
          <el-option value="创建">创建</el-option>
          <el-option value="删除">删除</el-option>
          <el-option value="修改">修改</el-option>
          <el-option value="开放">开放</el-option>
          <el-option value="审核">审核</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作人">
        <el-input size="small" v-model="form.user" />
      </el-form-item>
      <el-form-item label="操作日期">
        <el-date-picker
          size="small"
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small">查看</el-button>
      </el-form-item>
    </el-form>
    <el-table
      highlight-current-row
      :data="tableData"
      stripe
      :height="tableHeightLocal"
      border
    >
      <el-table-column prop="date" label="操作日期"></el-table-column>
      <el-table-column prop="type" label="操作类型"></el-table-column>
      <el-table-column prop="content" label="操作内容"></el-table-column>
      <el-table-column prop="name" label="操作人"></el-table-column>
      <el-table-column width="120px">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="check(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pagination="pagination"
      @changepage="pageNum2"
      @sizeChange="changeSize"
      :current-page.sync="currentPage"
    />

    <!-- 查看详情 -->
    <el-dialog :visible.sync="detailShow" title="详情" append-to-body>
      <!-- <el-table border highlight-current-row :data="detailData">
        <el-table-column
          prop="date"
          align="center"
          label="操作日期"
        ></el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="操作人"
        ></el-table-column>
        <el-table-column
          prop="type"
          align="center"
          label="操作类型"
        ></el-table-column>
        <el-table-column
          prop="oldData"
          align="center"
          label="原数据"
        ></el-table-column>
        <el-table-column
          prop="newData"
          align="center"
          show-overflow-tooltip
          label="修改内容"
        ></el-table-column>
      </el-table> -->

      <div class="detail" v-for="(item, index) in detailData" :key="index">
        <div class="left">{{ item.name }}</div>
        <div class="right">{{ item.value }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailShow: false,

      pagination: {
        total: 1,
        pageSize: 40,
      },
      currentPage: 1,
      form: {
        type: "",
        user: "",
        date: null,
      },
      detailData: [
        { name: "操作日期", value: "2020-11-28" },
        { name: "操作人", value: "admin" },
        { name: "操作类型", value: "创建" },
        { name: "原数据", value: "" },
        { name: "修改内容", value: "文件类型修改为文书档案" },
      ],
      tableData: [
        {
          date: "2020-11-28",
          type: "创建",
          content: "归档管理",
          name: "admin",
        },
      ],
    };
  },
  methods: {
    check(e) {
      this.detailShow = true;
    },
    changeSize(e) {
      this.pagination.pageSize = e;
    },
    pageNum2(e) {
      this.currentPage = e;
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

<style lang="scss" scoped>
.detail {
  display: flex;
  .left {
    flex: 1;
    border: 1px solid #f1f1f1;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  .right {
    flex: 3;
    padding: 10px;
    border: 1px solid #f1f1f1;
    display: flex;
    flex-direction: column;
  }
  &:hover {
    background-color:rgb(217, 236, 255);
  }
}
</style>