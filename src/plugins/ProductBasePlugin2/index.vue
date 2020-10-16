<!--
 * @Author: CiFong
 * @Date: 2020-04-30 17:33:41
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-28 18:48:24
 * @Description: 请输入
 -->
<template>
  <div>
    <template v-if="ModulePageNum === 10">
      <ProductBase2 />
    </template>
    <template v-else-if="ModulePageNum === 11">
      <ProductBaseSetting2 />
    </template>
  </div>
</template>
<script>
import ProductBase2 from "./ProductBase2";
import ProductBaseSetting2 from "./ProductBaseSetting2";

export default {
  data() {
    return {};
  },
  computed: {
    ModulePageNum() {
      return this.$store.getters.ModulePageNum;
    }
  },
  components: {
    ProductBase2,
    ProductBaseSetting2
  }
};
</script>
<style lang="scss" scoped></style>
