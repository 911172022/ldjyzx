<!--
 * @Author: CiFong
 * @Date: 2020-04-30 17:33:41
 * @LastEditors: CiFong
 * @LastEditTime: 2020-04-30 20:22:00
 * @Description: 请输入
 -->
<template>
  <div>
    <template v-if="ModulePageNum === 8">
      <ProductBase />
    </template>
    <template v-else-if="ModulePageNum === 9">
      <ProductBaseSetting />
    </template>
  </div>
</template>
<script>
import ProductBase from './ProductBase'
import ProductBaseSetting from './ProductBaseSetting'

export default {
  data() {
    return {
    }
  },
  computed: {
    ModulePageNum () {
      return this.$store.getters.ModulePageNum
    }
  },
  components: {
    ProductBase,
    ProductBaseSetting
  }
}
</script>
<style lang='scss' scoped>
</style>
