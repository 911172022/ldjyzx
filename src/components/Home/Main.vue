<template>
  <div class="content-wrapper">
    <template v-if="ModulePageNum === 1">
      <DMMain />
    </template>
    <template v-else-if="ModulePageNum === 2">
      <Announcement />
    </template>
    <!-- <template v-else-if="ModulePageNum === 2">
      <Echarts />
    </template>
    <template v-else-if="ModulePageNum === 3">
      <PWMain />
    </template>
    <template v-else-if="ModulePageNum === 4">
      <PerWMain />
    </template>
    <template v-else-if="ModulePageNum === 5">
      <LDMain />
    </template>
    <template v-else-if="ModulePageNum === 6">
      <DSMain />
    </template> -->
    <template v-else-if="ModulePageNum === 7">
      <Echart />
    </template>
  </div>
</template>
<script>

export default {
  computed: {
    ModulePageNum () {
      return this.$store.getters.ModulePageNum
    }
  },
  mounted() {
    console.log("main")
  }
}
</script>
<style lang="scss">
.content-wrapper {
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.content-wrapper>div{
  overflow: auto;
  flex: 1;
}
</style>
<style lang="scss">
  @import "@/scss/main";
</style>
