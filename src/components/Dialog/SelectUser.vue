<template>
  <el-dialog @open='openDialog' :append-to-body='appendToBody' class="addUser" :title="dialogObjtitle.title" :visible.sync="dialogObj.switch" width="60%" :before-close="dialogClose">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-tabs v-model="userName">
          <el-tab-pane class="addUser_User" label="用户" name="user">
              <div class="AU-search" style='margin-right: 30px'>
                <el-input placeholder="搜索用户" v-model="SearchUserText2" prefix-icon="el-icon-search" />
              </div>
              <el-table
                ref="userData"
                :data="userData"
                tooltip-effect="dark"
                class="userData"
                height="450"
                border
                @row-dblclick="addUserDblclick">
                <el-table-column prop="text" label="用户名"></el-table-column>
              </el-table>

          </el-tab-pane>
          <el-tab-pane  class="addUser_UserGroup" label="组织架构" name="userGroup">
            <div class="UserGroup">
              <div class="AU-search">
                <el-input placeholder="搜索用户" v-model="SearchUserText" prefix-icon="el-icon-search" />
              </div>
              <div class="AU-tree">
                <el-tree
                  class="filter-tree"
                  :load="loadNode"
                  lazy
                  :props="props"
                  highlight-current
                  ref="UserGroupList"
                  @node-click="handleNodeClick"
                  node-key="text"
                  :default-expanded-keys="DefaultNode"
                ></el-tree>
              </div>
              <div class="AU-table">
                <el-table :data="userGroupData" highlight-current-row height="250" style="width: 100%" @row-dblclick="addUserDblclick">
                  <el-table-column prop="text" label="用户名"></el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="12" style="padding-top: 55px;">
        <el-table
          class="addUserData"
          ref="addUserData"
          :data="addUserData"
          tooltip-effect="dark"
          height="450"
          border
          @row-dblclick="deleteDblclick">
          <el-table-column prop="text" label="用户名"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogClose">取 消</el-button>
      <el-button type="primary" size="small" @click="addUserHandle">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import UserApi from '../../api/services/user'

export default {
  props: {
    dialogObj: {
      type: Object,
      // 没有传参时才会被读取
      default: () => ({
        switch: false,
        title: '增加用户/用户组'
      })
    },
    // 是否嵌套的dialog
    appendToBody: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 用来初始化选择的
    selected: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // 切換用戶,用戶組
      userName: "user",
      // 用户列表
      userData: [],
      // 用戶組列表
      userGroupData: [],
      // 搜索用户(在组织架构那里搜索)
      SearchUserText: '',
      TimeId: -1,
      //  在用户那里搜索用户的
      SearchUserText2: '',
      TimeId2: -1,
      // 默认展开的节点
      DefaultNode: ['所有組織架構'],
      // 组织机构
      props: {
        label: 'text',
        isLeaf: 'leaf'
      },
      nodeKeyword: 'Root',
      groupKeyword: '',
      // 添加用户
      addUserData: []
    };
  },
  computed: {
    // 有传参, 但没有传 title
    dialogObjtitle() {
      return Object.assign({
        title: '增加用户/用户组'
      }, this.dialogObj)
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getAllUserList()
        } else {
          return
        }
      },
      deep: true
    },
    // 组织架构那里搜索用户
    SearchUserText () {
      clearTimeout(this.TimeId)
      this.TimeId = setTimeout(() => {
        this.getAllUserList2()
      }, 500)
    },
    // 用户那里搜索用户
    SearchUserText2() {
      clearTimeout(this.TimeId2)
      this.TimeId2 = setTimeout(() => {
        this.getAllUserList3()
      }, 500)
    }
  },
  methods: {
    // 打开dialog时候初始化数据
    openDialog() {
      this.addUserData = this.selected
    },
    // 用户列表 - 请求数据
    async getAllUserList () {
      let page = 1, Group = 'Root', limit = 1000
      const res = await UserApi.getAllUserList(page, limit, Group)
      if (res.success) {
        this.userData = res.data
      }
    },
    // 加载子树数据
    async loadNode(node, resolve) {
      if (node.level === 0) {
          return resolve([{ text: '所有組織架構' }])
      }
      let nodeKeyword = 'Root'
      if (node.data.fullpath !== undefined) {
        nodeKeyword = node.data.fullpath
      }
      const res = await UserApi.getUserGroupList(nodeKeyword)
      const rdata = []
      res.data.forEach(item => {
        rdata.push({
          text: item.text,
          leaf: item.leaf,
          fullpath: item.id
        })
      })
      resolve(rdata)
    },
    handleNodeClick(data) {
      if (data !== undefined) {
        // 防止重複點擊
        if (this.groupKeyword === data.fullpath) return
        this.groupKeyword = data.fullpath
      }
      this.getAllUserList2()
    },
    // 组织架构那里搜索用户
    async getAllUserList2 () {
      let page = 1, Group = this.groupKeyword, limit = 1000, filter = ''
      if (this.SearchUserText) {
        filter = this.SearchUserText
      }
      const res = await UserApi.getAllUserList(page, limit, Group, filter)
      this.userGroupData = res.data
    },
    // 用户那里搜索用户
    async getAllUserList3 () {
      let page = 1, Group = this.groupKeyword, limit = 1000, filter = ''
      if (this.SearchUserText2) {
        filter = this.SearchUserText2
      }
      const res = await UserApi.getAllUserList(page, limit, Group, filter)
      // this.userGroupData = res.data
      this.userData = res.data
    },
    // 选择用户添加
    addUserDblclick (e) {
      let arr = this.addUserData
      let index = arr.findIndex(item => item.text === e.text)
      if (index !== -1) {
        this.$message.error('已有該用戶')
      } else {
        this.addUserData.push({
          text: e.text,
          id: e.id
        })
      }
    },
    // 选择用户删除
    deleteDblclick (e) {
      let arr = this.addUserData
      let index = arr.findIndex(item => item.text === e.text)
      if (index !== -1) {
        arr.splice(index, 1)
      }
    },
    addUserHandle () {
      let vm = this
      let arr = vm.addUserData.map(item => item.id)
      let nameStr = vm.addUserData.map(item => item.text)
      nameStr = nameStr.join(',')
      // let UserList = arr.join(',')
      // let { WorkStateKeyword } = this.dialogObj
      // let ObjectKeyword = this.dialogObj.UserKeyword
      if (!arr.length) {
        vm.$message.error('请添加用户')
      } else {
        vm.$emit('selectedUser', { userList: vm.addUserData, nameStr })
      }
    },
    // 关闭弹窗
    dialogClose() {
      this.$emit("reData", false)
      this.resetData()
    },
    resetData () {
      this.SearchUserText = ''
      this.addUserData = []
    }
  }
}
</script>
<style lang="scss">
.addUser {
  .addUser_User {
    .userData {
      width: calc(100% - 30px);
    }
  }
  .addUser_UserGroup {
    .UserGroup {
      width: calc(100% - 30px);
    }
  }
  .AU-search {
    background-color: #f2f1f6;
    padding: 10px 20px 5px;
    border-radius: 7px 7px 0 0;
  }
  .AU-tree {
    border: 2px solid #f2f1f6;
    .filter-tree {
      height: 190px;
      overflow: auto;
      overflow-y: scroll;
    }
  }
  .AU-table {
    border: 2px solid #f2f1f6;
  }
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
    background-image: url("../../assets/tree/Smallfolder.png");
    background-size: 20px;
    top: -3px;
    left: 0;
    z-index: 2;
    width: 20px;
    height: 20px;
  }
  .el-tree-node__content {
    padding: 5px;
  }
}
</style>
