<template>
  <div class="NAVmainContainer">
    <!-- 标题 -->
    <!-- <el-row class="mainTitle">
      <el-col :span="24">
        <h1><i class="el-icon-s-claim" style="color: #FFBC40;"></i> 流程列表</h1>
      </el-col>
    </el-row> -->
    <!--列表-->
    <el-table
      :data="workflowList"
      class="mainTable NAVmainTable"
      :height="tableHeight + 70"
      border
      highlight-current-row
      @row-click="handleCurrentChange"
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="File" label="项目" max-width="20%" min-width="200" sortable show-overflow-tooltip />
      <el-table-column prop="DefWorkFlow" label="工作任务" sortable max-width="20%" min-width="200" show-overflow-tooltip />
      <el-table-column prop="Creater" label="要求回复时间" sortable max-width="20%" min-width="100" show-overflow-tooltip />
      <el-table-column prop="CreateDate" label="创建时间" sortable max-width="20%" min-width="100" show-overflow-tooltip />
    </el-table>
    <!-- 分页 -->
    <pagination :pagination="pagination" @changepage="pageNum2" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 消息列表
      currentRow: null,
      multipleSelection: [],
      workflowList: [],
      pagination: []
    }
  },
  updated () {
    if (this.$refs.vueCropper) {
      this.$refs.vueCropper.Update()
    }
  },
  computed: {
    ...mapGetters('workflow', ['WorkflowType']),
    ...mapGetters("menu", ["tableHeight"])
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    // 点击列表
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    // 多选列表
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    pageNum2(e) {
      let page = e
      let { WorkflowType } = this
      this.$store.dispatch('workflow/getWorkFlowPlaceList', { WorkflowType, page })
    },
    beforeClose () {
      this.uploadList.pop()
      this.cropperModel = false
    }
  }
};
</script>
<style lang="scss">
</style>
