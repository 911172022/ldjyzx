<template>
  <div class="content-wrapper">
    <template v-if="ModulePageNum === 1">
      <DMMain />
    </template>
    <template v-else-if="ModulePageNum === 81">
      <Announcement />
    </template>
    <template v-else-if="ModulePageNum === 83">
      <BackUp />
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
    <template v-else-if="ModulePageNum === 115">
      <BaoBiao />
    </template>
    <template v-else-if="ModulePageNum === 7">
      <Echart />
    </template>
    <template v-else-if="ModulePageNum === 9">
      <AllCaseNo />
    </template>
    <template v-else-if="ModulePageNum === 85">
      <DataManage />
    </template>
    <template v-else-if="ModulePageNum === 51">
      <OpenMain />
    </template>
    <template v-else-if="ModulePageNum === 104">
      <SystemLog />
    </template>
    <template v-else-if="ModulePageNum === 111">
      <Template />
    </template>
    <template v-else-if="ModulePageNum === 84">
      <DataList />
    </template>
    <template v-else-if="ModulePageNum === 33">
      <CheckMain />
    </template>
    <template v-else-if="ModulePageNum === 31">
      <CheckMain />
    </template>
    <template v-else-if="ModulePageNum === 34">
      <CheckMain />
    </template>
  </div>
</template>
<script>
export default {
  computed: {
    ModulePageNum() {
      return this.$store.getters.ModulePageNum;
    },
  },
  mounted() {
    console.log("main");
  },
};
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
.content-wrapper > div {
  overflow: auto;
  flex: 1;
}
</style>
<style lang="scss">
@import "@/scss/main";
</style>
