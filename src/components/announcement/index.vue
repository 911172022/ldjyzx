<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addAnnouncement"
      >新增</el-button
    >
    <el-table :data="tableData" border style="width: 100%; margin-top: 15px">
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="320"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="date"
        label="时间"
        width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="content" label="内容" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="tableClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pagination="pagination"
      @changepage="pageNum2"
      :current-page.sync="currentPage"
    />
    <Add :dialogObject="addObject" :formData="formData"></Add>
  </div>
</template>

<script>
import Add from "./add";
export default {
  components: { Add },
  data() {
    return {
      formData: {},
      addObject: {
        switch: false,
      },
      pagination: {
        pageSize: 1,
        total: 2,
        pageSizes: [10, 20, 30, 50],
      },
      currentPage: 1,
      tableData: [
        {
          title: "五一放假通知",
          date: "2020-04-25",
          content: "五一放假五天",
        },
        {
          title: "国庆中秋放假通知",
          content: "放假8天",
          date: "2020-09-25",
        },
      ],
    };
  },
  methods: {
    pageNum2(e) {},
    tableClick(e) {
      this.formData = {
        title: "测试",
        date: "2020-02-18",
        content: "",
      };
      this.addObject.switch = true;
    },
    addAnnouncement() {
      this.addObject.switch = true;
    },
  },
};
</script>

<style>
</style>