<template>
  <div class="asideL">
    <h3>
      <i class="el-icon-s-order" style="color: #FFBC40;"></i> 消息类别
    </h3>
    <div class="asideLLine" />
    <el-scrollbar v-loading="loading">
      <div class="asideLTreeOuter">
        <el-tree
          v-if="isReset"
          ref="treeBox"
          :props="props"
          :load="loadNode"
          class="asideLTree Common-Tree-Icon"
          node-key="id"
          lazy
          :highlight-current="true"
          @node-click="handleNodeClick"
        />
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import UserApi from "../../api/services/message";
import { mapGetters } from "vuex";
import User from "../../entity/User";
export default {
  data() {
    return {
      // 左侧选单 - 配置选项
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      loading: true,
      isReset: true
    };
  },
  computed: { ...mapGetters("project", ["isRefreshTree"]) },
  watch: {
    isRefreshTree: {
      handler(newValue) {
        if (newValue) {
          this.isReset = false;
          this.$store.commit("project/REFRESH_TREE", false);
          this.$nextTick(() => {
            this.isReset = true;
          });
        }
      }
    }
  },
  methods: {
    // 左侧选单 - 加载子树数据
    async loadNode(node, resolve) {
      const nodeKeyword = "";
      const res = await UserApi.getMessageTree(nodeKeyword);
      const rdata = [];
      res.data.forEach(item => {
        rdata.push({
          id: item.id,
          name: item.text,
          leaf: item.leaf
        });
      });
      resolve(rdata);
      this.loading = false;
      this.$nextTick(() => {
        this.$refs.treeBox.setCurrentKey(rdata[0].id);
        const data = {};
        data.id = rdata[0].id;
        this.handleNodeClick(data);
      });
    },
    // 左侧选单 - 节点被点击时的回调
    async handleNodeClick(data) {
      const MessageType = data.id,
        page = 1;
      this.$store.dispatch("PerMessage/getMessageList", { MessageType, page });
      this.$store.commit("PerMessage/GET_MESSAGE_ID", data.id);
    }
  }
};
</script>
