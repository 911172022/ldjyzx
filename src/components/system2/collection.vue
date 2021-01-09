<!--
 * @Author: your name
 * @Date: 2020-11-30 09:07:45
 * @LastEditTime: 2020-12-29 17:31:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gyy_oac:\Users\Shihx\Desktop\ldjyzx\src\components\system2\collection.vue
-->
<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      stripe
      highlight-current-row
      border
    >
      <el-table-column show-overflow-tooltip label="档案模块" prop="archTypeName"></el-table-column>
      <el-table-column show-overflow-tooltip label="档案分类" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="档案号" prop="archNo"></el-table-column>
      <el-table-column show-overflow-tooltip label="案卷题名" prop="title"></el-table-column>
      <el-table-column show-overflow-tooltip label="收藏时间" min-width="100" prop="createTime"></el-table-column>
      <el-table-column show-overflow-tooltip width="180" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="check(scope.row)" size="mini"
            >查看</el-button
          >
          <el-button type="primary" @click="deleteData(scope.row)" size="mini"
            >取消收藏</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import SearchApi from "@/api/services2/searchSystem";
export default {
  data() {
    return {
      tableData: [],
      pagination: {
        pageSize: 20,
        total: 0,
        pageSizes: [10, 20, 30, 50],
      },
      currentPage: 1,
      categoryId: "",
      archType: "",
      fieldName: "",
      searchItem: "",
      dataObject: {},
    };
  },
  methods: {
    pageNum2(e) {
      this.currentPage = e;
    },
    getList() {
      let data = {
        categoryId: this.categoryId,
        archType: this.archType,
        fieldName: this.fieldName,
        searchItem: this.searchItem,
      };
      SearchApi.getCollectList(data).then((res) => {
        this.tableData = res.data.list;
      });
    },
    check(e) {
      this.dataObject = {
        categoryId: e.categoryId,
        archId: e.archId,
      };
      this.getFileDetail(this.dataObject);
      this.fileDetailShow = true;
    },
    getFileDetail(data) {
      this.$store.dispatch("doc/getSearchInfo", data);
    },
    deleteData(e) {
      let data = {
        id: e.id,
      };
      SearchApi.deleteData(data).then((res) => {
        this.$message.success("取消收藏成功");
        this.getList();
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
</style>