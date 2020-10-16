<template>
  <div class="asideLOuter">
    <template v-if="ModulePageNum === 1">
      <DMAsideL />
    </template>
    <template v-else-if="ModulePageNum === 2">
      <PMAsideL />
    </template>
    <template v-else-if="ModulePageNum === 3">
      <PWAsideL />
    </template>
    <template v-else-if="ModulePageNum === 4">
      <PerWAsideL />
    </template>
    <template v-else-if="ModulePageNum === 5">
      <LDAsideL />
    </template>
    <template v-else-if="ModulePageNum === 6">
      <DSAsideL />
    </template>
    <!-- <template v-else-if="ModulePageNum === 7">
      <NAsideL />
    </template> -->
  </div>
</template>
<script>
export default {
  computed: {
    ModulePageNum() {
      return this.$store.getters.ModulePageNum;
    },
  },
};
</script>
<style lang="scss">
.asideLOuter {
  height: 100%;
  overflow: hidden;
}
</style>
<style lang="scss">
@import "@/scss/AsideL";
</style>
