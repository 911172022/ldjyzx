<template>
  <div>
    <div class="el-backtop" style="right: 10%; bottom: 50px;">
      <el-button class="DiskAndDataButton" type="primary" @click="pageChange">资料盘</el-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    pageChange() {
      this.$router.push({ path: "/login" });
    }
  }
};
</script>
<style lang="scss">
  @import "@/scss/index";
</style>
