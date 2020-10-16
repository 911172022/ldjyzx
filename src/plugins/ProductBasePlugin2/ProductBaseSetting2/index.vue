<!--
 * @Author: CiFong
 * @Date: 2020-04-29 20:31:37
 * @LastEditors: CiFong
 * @LastEditTime: 2020-08-24 15:30:20
 * @Description: 产品库设置页
 -->
<template>
  <div class="productbase-setting">
    <el-page-header @back="goBack" content="产品设置" />
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">产品种类</el-menu-item>
      <el-menu-item index="4">行业种类</el-menu-item>
      <el-menu-item index="2">专业种类</el-menu-item>
      <el-menu-item index="5">品牌种类</el-menu-item>
      <el-menu-item index="6">客户种类</el-menu-item>
      <el-menu-item index="3">产品列表</el-menu-item>
    </el-menu>
    <div>
      <template v-if="key === '1'">
        <productType />
      </template>
      <template v-else-if="key === '2'">
        <speciality />
      </template>
      <template v-else-if="key === '3'">
        <ProductList />
      </template>
      <template v-else-if="key === '4'">
        <industry />
      </template>
      <template v-else-if="key === '5'">
        <brand />
      </template>
      <template v-else-if="key === '6'">
        <consumerType />
      </template>
    </div>
  </div>
</template>
<script>
import productType from "./ProductType";
import speciality from "./speciality";
import brand from "./brand";
import industry from "./industry";
import consumerType from "./consumerType";
import ProductList from "./ProductList";
export default {
  data() {
    return {
      activeIndex: "3",
      key: "3"
    };
  },
  components: {
    productType,
    speciality,
    industry,
    brand,
    consumerType,
    ProductList
  },
  methods: {
    handleSelect(key, keyPath) {
      this.key = key;
    },
    goBack() {
      this.$router.push({ name: "ProductBase2" });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../scss/Common";
</style>
