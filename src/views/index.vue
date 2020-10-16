<template>
  <div id="home">
    <img src="../assets/index.jpg" class="indexImg" alt />
    <!-- <div class="el-backtop" style="right: 100px; bottom: 50px;">
      <el-button class="DiskAndDataButton" type="primary" @click="pageChange">资料盘</el-button>
        </div>-->
    <InformationDiskButton />
    <ProductLibraryButton v-if="!showFY" />
  </div>
</template>
<script>
import InformationDiskButton from "../plugins/common/InformationDiskButton";
import ProductLibraryButton from "../plugins/common/ProductLibraryButton";
import { PluginsList } from "../const";

export default {
  name: "index",
  components: {
    InformationDiskButton,
    ProductLibraryButton,
  },
  created() {
    // console.log(this.$route.query)
    // 如果是广建哪里过来的，根路由带了登录信息，跳转
    if (this.$route.query.sid) {
      this.$store.commit("SAVE_USER", this.$route.query);
      // 跳转到doc-Manager
      this.$router.push({ name: "DocManagement" });
    }
  },
  methods: {
    pageChange() {
      this.$router.push({ path: "/login" });
    },
  },
  computed: {
    showFY() {
      return PluginsList.indexOf("FYPlugin") != -1;
    },
  },
};
</script>
<style lang="scss" scoped>
body {
  overflow: auto;
}
.indexImg {
  width: 100%;
  height: 100%;
  margin-bottom: -3px;
}
</style>
<style lang="scss">
@import "@/scss/index";
</style>
