<!--
 * @Author: CiFong
 * @Date: 2020-04-29 20:31:37
 * @LastEditors: CiFong
 * @LastEditTime: 2020-04-30 20:22:35
 * @Description: 产品库设置页
 -->
<template>
  <div class="productbase-setting">
    <el-page-header @back="goBack" content="产品设置" />
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect">
      <el-menu-item index="1">产品种类</el-menu-item>
      <el-menu-item index="2">行业种类</el-menu-item>
      <el-menu-item index="3">产品列表</el-menu-item>
    </el-menu>
    <div>
      <template v-if="key === '1'">
        <ProductCategory />
      </template>
      <template v-else-if="key === '2'">
        <IndustryCategory />
      </template>
      <template v-else-if="key === '3'">
        <ProductList />
      </template>
    </div>
  </div>
</template>
<script>
import ProductCategory from './ProductCategory'
import IndustryCategory from './IndustryCategory'
import ProductList from './ProductList'
export default {
  data() {
    return {
      activeIndex: '3',
      key: '3'
    };
  },
  components: {
    ProductCategory,
    IndustryCategory,
    ProductList
  },
  methods: {
    handleSelect(key, keyPath) {
      this.key = key
      console.log(key, keyPath);
    },
    goBack() {
      this.$router.push({ name: "ProductBase" })
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../scss/Common";
</style>
