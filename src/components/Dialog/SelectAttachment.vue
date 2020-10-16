<template>
  <el-dialog class="SelectAttachment width-70" title="选择目录或文档" :visible.sync="dialogObj.switch" width="90%" :before-close="dialogClose" append-to-body>
    <el-row :gutter="20" style="height: 500px;">
      <el-col :span="12" class="SelectAttachment-left">
        <el-scrollbar>
          <div class="asideTree">
            <el-tree
              :props="props"
              :load="loadNode"
              lazy
              highlight-current
              ref="DocList"
              class="Common-Tree-Icon"
              @node-click="handleNodeClick"
              :render-content="renderContent"
            ></el-tree>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="12">
        <el-table
          ref="selectList"
          :data="selectList"
          tooltip-effect="dark"
          style="width: 500px"
          height="500"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55" align="center">
          </el-table-column>
          <!-- 为什么叫用户名？ -->
          <!-- <el-table-column prop="Title" label="用户名"></el-table-column> -->
          <el-table-column prop="Title" label="文件名"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogClose">取消</el-button>
      <el-button type="primary" size="small" @click="selectHandle">选择</el-button>
    </span>
  </el-dialog>
</template>
<script>
import UserApi from '../../api/services/project'
import UserApi2 from '../../api/services/doc'
import { Doc_TreeIconChange } from '@/util/Common'

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
  data() {
    return {
      props: {
        label: "text",
        isLeaf: "leaf"
      },
      multipleSelection: [],
      selectList: [],
      isFirst: true,
      node: {},
      resolve: {},
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (!newValue.switch) {
          return
        }
      },
      deep: true
    },
  },
  methods: {
    // 选择按钮传值
    selectHandle () {
      this.$emit('Attached', this.multipleSelection)
      this.dialogClose()
    },
    // 获取列表值
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 关闭弹窗
    dialogClose() {
      this.node.childNodes = []
      this.loadNode(this.node, this.resolve)
      this.multipleSelection = []
      this.selectList = []
      this.isFirst = true
      this.$emit("reData", false)
    },
    // 加载子树数据
    async loadNode(node, resolve) {
      if (this.isFirst) {
        this.node = node
        this.resolve = resolve
        this.isFirst = false
      }
      let nodeKeyword = 'Root'
      if (node.data !== undefined) {
        nodeKeyword = node.data.projectId
      }
      const ProjectType = '1'
      const res = await UserApi.getProjectList(nodeKeyword, ProjectType)
      const rdata = []
      res.data.forEach(item => {
        rdata.push({
          text: item.text,
          leaf: item.leaf,
          projectId: item.Keyword,
          fullpath: item.id,
          icon: Doc_TreeIconChange(item.leaf) // 切换目录树图标
        })
      })
      resolve(rdata)
    },
    // 目录树内容自定义渲染方式
    renderContent(h, { node, data, /*store*/ }) {
      return (
        <span>
          <img src={data.icon} width="20px" style="vertical-align: text-bottom;" />
          <span style="padding-left: 5px;">{node.label}</span>
        </span>
      )
    },
    // 节点被点击时的回调
    async handleNodeClick(data) {
      let ProjectKeyWord = data.projectId, filterJson = '', page = 1, limit = 50
      const res = await UserApi2.getDocList(ProjectKeyWord, filterJson, page, limit)
      if (res.success) {
        this.selectList = res.data
      }
    }
  }
}
</script>
<style lang="scss">
.SelectAttachment {
  .SelectAttachment-left {
    height:100%;
    border: 1px solid #ebeef5;
    padding: 5px;
  }
}
</style>
