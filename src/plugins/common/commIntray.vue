<template>
<div>
  <InTray :dialogObj="InTrayData" @reData="reInTray" />
  <FyInTray :dialogObj="FyInTrayData" @reData="reFyInTray" />
</div>

</template>

<script>
// import InTray from '../GJEPCPlugin/InTray'
// import FyInTray from '../FYPlugin/FyInTray'
import { PluginsList } from '../../const.js'

export default {
  props: ['InTrayType', 'docKeyWord'],
  data() {
    return {
      //收文处理弹窗
      InTrayData: {
        switch: false
      },
      // zy end
      //方圆
      //收文处理弹窗
      FyInTrayData: {
        switch: false
      },
    }
  },
  methods: {
    reInTray(e) {
      this.InTrayData.switch = e;
      this.$emit("reIntrayData")
    },
    reFyInTray(e) {
      this.FyInTrayData.switch = e;
      this.$emit("reIntrayData")
    }
  },
  watch: {
    InTrayType(newValue){
      // 2020.4.22-1
      // 有华西项目的
      if(PluginsList.indexOf('HXPlugin') != -1){
        if(newValue == 'GetDocument'){
          this.InTrayData.switch = true;
          this.InTrayData.docKeyWord = this.docKeyWord;
        }
      }
      if (PluginsList.indexOf("FYPlugin") != -1) {
        if(newValue == 'FyGetDocument'){
         this.FyInTrayData.switch = true;
         this.FyInTrayData.docKeyWord = this.docKeyWord;
       }
      }
    }
  }
}

</script>
