<template>
  <div>
    <!-- <el-scrollbar> -->
    <div class="collection">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, index) in tableList" :key="index">
          <el-card class="card">
            <p class="title">{{ item.title }}</p>
            <p>{{ item.date }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- </el-scrollbar> -->
    <pagination
      class="page"
      :pagination="pagination"
      @changepage="pageNum2"
      :current-page.sync="currentPage"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableList: [
        { title: "测试收藏夹标题", date: "2020-11-25" },
        { title: "测试收藏夹标题", date: "2020-11-25" },
        { title: "测试收藏夹标题", date: "2020-11-25" },
        { title: "测试收藏夹标题", date: "2020-11-25" },
        { title: "测试收藏夹标题", date: "2020-11-25" },
        { title: "测试收藏夹标题", date: "2020-11-25" },
        { title: "测试收藏夹标题", date: "2020-11-25" },
        { title: "测试收藏夹标题", date: "2020-11-25" },
        { title: "测试收藏夹标题", date: "2020-11-25" },
      ],
      pagination: {
        pageSize: 1,
        total: 9,
        pageSizes: [10, 20, 30, 50],
      },
      currentPage: 1,
    };
  },
  methods: {
    pageNum2(e) {
      this.currentPage = 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.collection {
  display: flex;
  flex-wrap: wrap;
  padding: 40px;
  .card {
    margin: 20px;
    cursor: pointer;
    &:hover {
      .title {
        color: #409eff;
      }
    }
    .title {
      transition: all 0.2s;
    }
  }
}
</style>
<style>
.g-footer .footer-right {
  text-align: center;
}
</style>