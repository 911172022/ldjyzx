<template>
  <div class="asideROuter">
    <!-- <template v-if="ModulePageNum === 1">
      <DMAsideR />
    </template> -->
    <!-- <template v-else-if="ModulePageNum === 2">
      <PMAsideR />
    </template>
    <template v-else-if="ModulePageNum === 3">
      <PWAsideR />
    </template>
    <template v-else-if="ModulePageNum === 4">
      <PerWAsideR />
    </template>
    <template v-else-if="ModulePageNum === 5">
      <LDAsideR />
    </template>
    <template v-else-if="ModulePageNum === 6">
      <DSAsideR />
    </template> -->
    <!-- <template v-else-if="ModulePageNum === 7">
      <NAsideR />
    </template> -->
  </div>
</template>
<script>
export default {
  computed: {
    ModulePageNum () {
      return this.$store.getters.ModulePageNum
    }
  }
}
</script>
<style lang="scss">
.asideROuter {
  height: 100%;
  overflow: hidden;
  overflow-x: auto;
}
</style>
<style lang="scss">
  @import "@/scss/AsideR";
</style>
