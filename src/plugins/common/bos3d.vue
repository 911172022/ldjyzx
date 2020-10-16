<template>
  <div id='viewerWrapper'>
    <div id="viewer3D" ref='viewer' style="width:100%; height:100%"></div>
  </div>
</template>
<script>
import { HOST3D } from '../../const'
export default {
  data(){
    return {
      modelKeyOld: null,
      viewerWidth: 1000,
      viewerHeithg: 700,
    }
  },
  props: {
    modelKey: null,
    projectKey: null,
  },
  mounted(){
    this.$store.commit('home/ASIDER_HIDE_CONTROL')
    setTimeout(() => {
      this.getViewerSize()
      this.setModel()
    }, 1000)
    // 适应屏幕大小
    // viewer3D.autoResize();
    // window.addEventListener("resize", function() {
    //   viewer3D.autoResize();
    // })
    // 设置视窗大小
    // viewer3D.resize(500, 500)
    // 传入构件key，查看构件
    // viewer3D.showComponentsByKey("M1533004205283_35ulmdG1fBmv6VyzLMAXX5");
    // 卸载模型
    // setTimeout(() => {
    //   viewer3D.viewerImpl.unload(modelKey)
    // }, 1000 * 10)
  },
  methods: {
    setModel() {
      let option = {
        // host: "http://bos3d.bimwinner.com",
        host: HOST3D,
        viewport: "viewer3D"
      };
      let viewer3D = new window.BIMWINNER.BOS3D.Viewer(option);
      let modelKey = this.modelKey
      let projectKey = this.projectKey
      let tool = new window.BIMWINNER.BOS3D.UI.ToolBar(viewer3D);
      tool.createTool();
      /* let res = */ viewer3D.addView(modelKey, projectKey);

      // if (!res) {
      //   this.$message({
      //     message: '获取bos模型失败！',
      //     type: 'error'
      //   })
      // }

      viewer3D.resize(this.viewerWidth, this.viewerHeight)
      // viewer3D.autoResize()
    },
    getViewerSize() {
      this.viewerHeight = this.$refs.viewer.offsetHeight
      this.viewerWidth = this.$refs.viewer.offsetWidth
    }
  },
}

</script>
<style lang='scss' scoped>
#viewerWrapper{
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  flex: 1;
}
</style>
