<template>
  <div class="g-footer">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="24" class="footer-right">
        <div>
          <el-pagination
            background
            :current-page="pageNum"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            :page-sizes="pagination.pageSizes"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "Pagination",
  props: ["pagination"],
  data() {
    return {
      pageNum: 1,
    };
  },
  methods: {
    handleSizeChange(e) {
      this.$emit("sizeChange", e);
    },
    changePage(pageNum) {
      this.$emit("changepage", pageNum);
    },
    handleCurrentChange(val) {
      const pageNum = val;
      this.changePage(pageNum);
    },
  },
};
</script>
<style lang="scss">
.g-footer {
  margin-top: 20px;
  .footer-right {
    text-align: right;
  }
}
</style>
