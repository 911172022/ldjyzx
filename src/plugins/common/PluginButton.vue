<template>
  <div id='PluginButton'>
    <!-- 华西项目-->
    <template v-if='HXPluginShow'>
      <!-- <el-button size="small" type="primary" @click="openWorkTime">填报工时</el-button>
      <el-button
        size="small"
        type="primary"
        @click="ProjectSetUp"
        style="margin-right: 10px;"
      >项目立项</el-button> -->
    </template>
    <!--方圆项目-->
    <template v-if='FYPluginShow'>
      <el-button
        size="small"
        type="primary"
        @click="FyProjectSetUp"
        style="margin-right: 10px;"
      >项目立项</el-button>
    </template>


    <!-- 项目立项 华西-->
    <ProjectSetUp v-if='HXPluginShow' :dialogObj="ProjectSetUpData" @reData="reProjectSetUp" />
    <!-- 填报工时 -->
    <WorkTime :dialogObj="WorkTimeData" @reData="reWorkTime" />
    <!--方圆 Start-->
    <!-- 项目立项 方圆-->
    <FyProjectSetUp v-if='FYPluginShow' :dialogObj="FyProjectSetUpData" @reData="reFyProjectSetUp" />
    <!--方圆 End-->
  </div>
</template>

<script>
import { PluginsList } from '../../const.js'

export default {
  data() {
    return {
      // ZY start
      ProjectSetUpData: {
        switch: false
      },
      WorkTimeData: {
        switch: false
      },
      // ZY end
      // fy start
      FyProjectSetUpData: {
        switch: false
      },
      // fy end
      // 2020.4.22-1
      FYPluginShow: false,
      HXPluginShow: false,
    }
  },
  created(){
    // 2020.4.22-1
    if (PluginsList.indexOf('HXPlugin') != -1){
      this.HXPluginShow = true
    } else {
      this.HXPluginShow = false
    }
    if (PluginsList.indexOf("FYPlugin") != -1){
      this.FYPluginShow = true
    } else {
      this.FYPluginShow = false
    }
  },
  methods: {
    openWorkTime() {
      this.WorkTimeData.switch = true;
    },
    reWorkTime(e) {
      this.WorkTimeData.switch = e;
    },
    ProjectSetUp() {
      this.ProjectSetUpData.switch = true
    },
    reProjectSetUp(e) {
      this.ProjectSetUpData.switch = e;
    },
    FyProjectSetUp() {
      this.FyProjectSetUpData.switch = true
    },
    reFyProjectSetUp(e) {
      this.FyProjectSetUpData.switch = e;
    },
  }
}
</script>

<style lang="scss">
#PluginButton>div{
  text-align: left;
}

</style>
