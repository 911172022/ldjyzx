<template>
  <div class="content-wrapper">
    <template v-if="ModulePageNum === 1">
      <DMMain />
    </template>
    <template v-else-if="ModulePageNum === 81">
      <Announcement />
    </template>
    <template v-else-if="ModulePageNum === 101">
      <Department />
    </template>
    <template v-else-if="ModulePageNum === 102">
      <User />
    </template>
    <template v-else-if="ModulePageNum === 103">
      <UserGroup />
    </template>
    <template v-else-if="ModulePageNum === 113">
      <SystemType />
    </template>
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
