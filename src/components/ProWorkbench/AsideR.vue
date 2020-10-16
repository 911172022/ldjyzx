<template>
  <div class="asideR">
    <el-tabs class="asideRTabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="流程" name="a">
        <Process />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'a'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>
