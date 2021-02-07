<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addAnnouncement"
      >新增</el-button
    >
    <el-table
      :height="tableHeightLocal+80"
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="title" label="标题" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="time" label="时间" width="120"> </el-table-column>
      <el-table-column prop="creatorName" label="发起人" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="tableClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small" @click="deleteTable(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pagination="pagination"
      @changepage="pageNum2"
      @sizeChange="sizeChange"
      :current-page.sync="currentPage"
    />
    <Add :dialogObject="addObject" @cancel="cancel" :formData="formData"></Add>
  </div>
</template>

<script>
import Add from "./add";
import ReportApi from "@/api/services2/announcement";
import { mapGetters } from 'vuex';

export default {
  components: { Add },
  data() {
    return {
      formData: {},
      addObject: {
        switch: false,
      },
      pagination: {
        pageSize: 10,
        total: 0,
        pageSizes: [10, 20, 30, 50],
      },
      currentPage: 1,
      tableData: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters("doc",["tableHeightLocal"])
  },
  methods: {
    sizeChange(e) {
      this.pagination.pageSize = e;
      this.getList();
    },
    pageNum2(e) {
      this.currentPage = e;
      this.getList();
    },
    cancel(e) {
      this.addObject.switch = e;
      this.getList();
    },
    tableClick(e) {
      this.addObject.switch = true;
      this.addObject.title = "编辑";
      this.addObject.announcementId = e.announcementId;
      this.formData = {
        content: e.content,
        title: e.title,
        date: e.time,
        isEdit: true
      };
    },
    addAnnouncement() {
      this.addObject.switch = true;
      this.addObject.title = "新增";
    },
    getList() {
      this.loading = true;
      let data = {
        pageNum: this.currentPage,
        pageSize: this.pagination.pageSize,
      };
      ReportApi.getList(data).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.pagination.total = res.data.total;
        }
        this.loading = false;
      });
    },
    deleteTable(e) {
      let data = {
        announcementID: e.announcementId,
      };
      ReportApi.deleteReport(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.getList();
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style>
</style>