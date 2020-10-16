<template>
  <div>
    <el-dialog
      title="流程定义"
      :visible.sync="dialogObj.switch"
      width="95%"
      :before-close="dialogClose"
    >
    <template>
        <div>
            <!-- <FlowByG6 /> -->
            <G6Editor />
        </div>
    </template>
    </el-dialog>
  </div>
</template>    
<script  type='text/ecmascript-6'>
//import FlowByG6 from "@/components/Process/DefWorkflow/FlowByG6.vue";
//模块安装方法：npm install --save @antv/g6@3.0.5-beta.9
import G6Editor from './workflowEditor/components/G6Editor'

G6Editor.install = function (Vue) {
    Vue.component(G6Editor.name, G6Editor)
}

export default {
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: function() {
        return {
          switch: false
        };
      }
    }
  },
  components: {
    G6Editor
  },
  data() {
    return {
          }
  },
  methods: {
    // 关闭弹窗
    dialogClose() {
      this.$emit("reData", false);
    }
  }
}
</script>

<!--<style lang='scss' scoped>
</style>-->