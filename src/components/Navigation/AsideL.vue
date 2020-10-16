<template>
  <div class="PWDetail">
    <el-tabs class="PWDetail_tabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="收藏夹" name="a">
        <el-scrollbar v-loading="loading">
          <div>
            <el-tree
              ref="treeBox"
              :props="props"
              :load="loadNode"
              node-key="id"
              lazy
              highlight-current
              class="Common-Tree-Icon"
              @node-click="getDocLocation"
            />
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import UserApi from "../../api/services/user";
import UserApi2 from "../../api/services/project";
export default {
  data() {
    return {
      activeName: "a",
      // 左侧选单 - 配置选项
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      loading: true
    };
  },
  methods: {
    // 左侧选单 - 加载子树数据
    async loadNode(node, resolve) {
      const res = await UserApi.getFavoritesList();
      const rdata = [];
      res.data.forEach(item => {
        rdata.push({
          id: item.Keyword,
          name: item.Title,
          leaf: true
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
    handleNodeClick(data) {
      const WorkflowType = data.id, page = 1
      this.$store.dispatch('workflow/getWorkFlowPlaceList', { WorkflowType, page })
    },
    async getDocLocation(e) {
      //  储存位置
      await UserApi2.saveLastProject(e.id);
      this.$router.push({ name: "DocManagement" });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
<style lang="scss">
.PWDetail {
  height: calc(100% - 8px);
  overflow: hidden;
  padding-top: 8px;
  .PWDetail_tabs {
    height: 100%;
    .el-tabs__content {
      height: 100%;
      position: static;
      #pane-a {
        overflow-x: auto;
      }
    }
  }
}
</style>
<style lang="scss">
.el-scrollbar {
  .el-scrollbar__wrap {
    // overflow: hidden;
    overflow-y: scroll;
  }
}
.ProClassification2 {
  height: 100%;
  overflow: hidden;
  h3 {
    font-size: 1em;
    font-weight: 0;
    margin-top: 0;
  }
  .line {
    height: 1px;
    background-color: #e0e6ed;
    margin: 10px 0 20px;
  }
  .el-tree {
    border: 0;
    .el-tree-node__label {
      position: relative;
      padding-left: 30px;
    }
    .el-tree-node__label:before {
      content: "";
      position: absolute;
      background-image: url("../../assets/tree/document_directory.png");
      background-size: 20px;
      top: -3px;
      left: 0;
      z-index: 2;
      width: 20px;
      height: 20px;
    }
    .el-tree-node__content {
      padding: 3px;
    }
  }
}
</style>
