<template>
  <div>
    <el-dialog title="创建设计阶段并选择参与专业" :visible.sync="SelectMajorsData.switch" width="25%">
      <SelectMajors :dialogObj="SelectMajorsData" @reData="reSelectMajors" />
    </el-dialog>
    <!-- 选择校核人员弹窗 -->
    <ChooseCollator :dialogObj="CollatorData" @reData="reCollator" />
    <!-- 选择分发专业 -->
    <AllotMajors v-if="showWitchAllotMajors != 'FY'" :dialogObj="AllotMajorsData" @reData="reAllotMajors" />
    <!-- 方圆的选择分发专业 -->
    <FyAllotMajors v-if='showWitchAllotMajors === "FY"' :dialogObj='AllotMajorsData' @reData='reAllotMajors'/>
  </div>
</template>

<script>
import { PluginsList } from '../../const.js'
export default {
  data() {
    return {

    }
  },
  computed: {
    showWitchAllotMajors() {
      if (PluginsList.indexOf('FYPlugin') != -1) {
        return 'FY'
      }
      return ""
    }
  },
  props: ['SelectMajorsData', 'SelectMajorData', 'CollatorData', 'AllotMajorsData'],
  methods: {
    //ZY start
    reSelectMajors(e) {
      this.SelectMajorsData.switch = e;
    },
    reCollator(e) {
      this.CollatorData.switch = e;
    },
    reAllotMajors(e) {
      this.AllotMajorsData.switch = e;
    },
  }
}
</script>
