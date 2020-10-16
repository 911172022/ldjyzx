<template>
  <div class="treeMenu">
    <label v-for="item in this.treeMenuData" :key="item.Keyword">
      <el-menu-item v-if="item.leaf" :index="item.id">{{item.text}}</el-menu-item>
      <el-submenu v-else :index="item.id">
        <template slot="title">
          <span>{{item.text}}</span>
        </template>
        <label>
          <TreeMenu :treeMenuData="item.children" />
        </label>
      </el-submenu>
    </label>
  </div>
</template>

<script>
export default {
  name: "TreeMenu",
  props: {
    treeMenuData: {
      type: Array
    }
  }
};
</script>