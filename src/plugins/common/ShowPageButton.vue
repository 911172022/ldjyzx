<template>
  <div>
    <div class="el-backtop" style="right: 10%; bottom: 50px;" v-if='showBtn'>
      <el-button class="DiskAndDataButton" type="primary" @click="pageChange">展示页</el-button>
    </div>
  </div>
</template>
<script>
import { PluginsList } from '../../const.js'
export default {
  methods: {
    pageChange() {
      this.$router.push({ path: "/" });
    }
  },
  computed: {
    showBtn() {
      if (PluginsList.indexOf("I3VTDPlugin") != -1) {
        return true
      } else {
        return false
      }
    }
  }
};
</script>
<style lang="scss">
  @import "@/scss/index";
</style>
