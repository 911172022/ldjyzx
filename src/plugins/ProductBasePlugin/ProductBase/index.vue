<!--
 * @Author: CiFong
 * @Date: 2020-04-30 17:35:03
 * @LastEditors: CiFong
 * @LastEditTime: 2020-04-30 20:14:38
 * @Description: 请输入
 -->
<template>
  <div id='productLibraryMain'>
    <requirementSelect />
    <div class="setting-button">
      <el-button type="primary" size="mini" @click="changeSetting">产品设置</el-button>
    </div>
    <productShow />    
  </div>
</template>

<script>
// 上边的条件查询
import requirementSelect from "./requirementSelect.vue"
// 下边的产品显示
import productShow from './productShow.vue'

export default {
  name: 'productLibraryMain',
  components: {
    requirementSelect, productShow,
  },
  data(){
    return {}
  },
  methods: {
    changeSetting () {
      this.$router.push({ name: "ProductBaseSetting" })
    }
  }
}

</script>

<style lang='scss' scoped>
.setting-button {
  text-align: right;
  margin-top: 10px;
  padding: 0 5px;
}
</style>
