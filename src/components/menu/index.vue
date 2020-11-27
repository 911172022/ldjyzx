<template>
  <div>
    <template v-for="(item, index) in menuList">
      <el-submenu
        :key="index"
        v-if="item.childList.length > '0'"
        :index="item.menu.name"
      >
        <template slot="title">
          <i class="el-icon-s-tools" />
          <span slot="title">{{ item.menu.name }}</span>
        </template>
        <MenuTree :menu-data="item.childList" />
      </el-submenu>
      <el-menu-item :key="index" v-else :index="item.menu.path">
        <span slot="title">{{ item.menu.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import SystemApi from "@/api/services2/system";
export default {
  name: "menu",
  data() {
    return {
      menuList: [],
    };
  },
  mounted() {
    this.getMenuTreeList();
  },
  methods: {
    getMenuTreeList() {
      let data = {
        parentId: "",
      };
      SystemApi.getMenuTreeList(data).then((res) => {
        if (res.code === 200) {
          this.menuList = res.data;
        }
      });
    },
  },
};
</script>

<style>
</style>