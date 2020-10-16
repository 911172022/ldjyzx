<template>
  <div class="asideR">
    <el-tabs class="navigationNews" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="新消息" name="a">
        <el-table
          class="asideRTable"
          :data="messageList"
          highlight-current-row
          @current-change="handleCurrentChange"
          border
          height="780">
          <el-table-column prop="Sender" label="发送者" show-overflow-tooltip />
          <el-table-column prop="Title" label="标题" show-overflow-tooltip />
          <el-table-column prop="SendDatetime" label="发送时间" show-overflow-tooltip />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      activeName: "a"
    };
  },
  mounted() {
    let MessageType = "/_1",
      page = 1;
    this.$store.dispatch("PerMessage/getMessageList", { MessageType, page });
  },
  computed: {
    ...mapGetters("PerMessage", ["messageList", 'MessageType'])
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCurrentChange(val) {
      console.log(val);
      this.currentRow = val
    }
  }
};
</script>
<style lang="scss">
.opinionData {
  width: 100%;
  .opinion_span {
    display: block;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.navigationNews {
  .el-tabs__content {
    height: 100%;
      position: static;
  }
}
</style>