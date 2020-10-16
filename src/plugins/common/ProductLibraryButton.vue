<template>
  <div id='ProductLibraryButton'>
    <div class="el-backtop" style="right: 10%; bottom: 100px;">
      <el-button class="DiskAndDataButton product-library-button" type="primary" @click="pageChange">产品页</el-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    pageChange() {
      this.$router.push({ path: "/login?refer=productLibrary" });
    }
  }
};
</script>
<style lang="scss">
  @import "@/scss/index";
</style>
