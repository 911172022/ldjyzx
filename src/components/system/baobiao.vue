<!--
 * @Author: your name
 * @Date: 2020-11-26 19:15:51
 * @LastEditTime: 2021-01-20 11:46:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \gyy_oac:\Users\Shihx\Desktop\ldjyzx\src\components\system\baobiao.vue
-->
<template>
  <div>
    <div class="flex-row">
      <!-- <el-button type='primary'>新增</el-button> -->
    </div>
    <el-table
      v-loading="loading"
      :data="tableList"
      border
      :height="tableHeightLocal+100"
    >
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="print(scope)"
            >打印</el-button
          >
          <el-button type="danger" size="mini" @click="del(scope)"
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
      :current-page.sync="currentPage"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      loading: false,
      tableList: [
        {
          name: "测试报表",
        },
        {
          name: "测试报表1",
        },
        {
          name: "测试报表2",
        },
        {
          name: "测试报表3",
        },
        {
          name: "测试报表4",
        },
      ],
      pagination: {
        pageSize: 20,
        total: 1,
      },
      currentPage: 1,
    };
  },
  methods: {
    print(e) {},
    del(e) {
      console.log(e);
      this.tableList.splice(e.$index, 1);
    },
    pageNum2(e) {
      this.currentPage = e;
      this.getList();
    },
    changeSize(e) {
      this.pagination.pageSize = e;
      this.getList();
    },
    getList() {},
  },
  computed: {
    ...mapGetters("doc",["tableHeightLocal"])
  },
};
</script>

<style>
</style>