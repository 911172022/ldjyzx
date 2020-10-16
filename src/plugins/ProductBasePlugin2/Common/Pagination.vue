<!--
 * @Author: CiFong
 * @Date: 2020-04-29 21:13:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-04-30 16:58:30
 * @Description: 分页功能
 * 必传值: pageNum 当前页数, pageSize 每页显示条目个数, total 总条目数
 -->
<template>
  <div>
    <el-pagination
      :hide-on-single-page="isSwitch"
      :current-page="pageNum"
      :pager-count="pageCount"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pageTotal"
      @current-change="handleCurrentChange"
      background
    />
  </div>
</template>
<script>
export default {
  name: 'Pagination-FK',
  props: {
    pageTotal: {
      type: Number,
      required: true,
      default: 0
    },
    pageSize: {
      type: Number,
      required: true,
      default: 1
    },
    pageNum: {
      type: Number,
      required: true,
      default: 1
    }
  },
  data() {
    return {
      isSwitch: false,
      pageCount: 5 // 分页按钮的数量
    }
  },
  watch: {
    pageTotal: {
      handler(newValue) {
        // 当只有一笔资料不显示分页功能
        if (newValue < 2) this.isSwitch = true
        else this.isSwitch = false
      },
      deep: true
    }
  },
  methods: {
    // 切换页数 - 传给父组件
    handleCurrentChange(val) {
      this.$emit('changepage', val)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
