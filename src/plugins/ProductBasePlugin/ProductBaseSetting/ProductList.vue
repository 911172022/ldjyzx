<!--
 * @Author: CiFong
 * @Date: 2020-04-29 21:13:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-05-09 08:44:05
 * @Description: 产品列表
 -->
<template>
  <div class="product-list">
    <el-row>
      <el-col :span="24" class="product-top-button">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddData('创建产品')">增加</el-button>
      </el-col>
      <el-col :span="24" class="product-table">
        <el-table
          :data="tableData"
          style="width: 100%"
          row-key="keyword"
          border
          lazy
          :load="tableLoad"
          :tree-props="treeprops"
           v-loading="tableLoading">
          <el-table-column prop="name" label="名称" />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope" v-if="scope.row.operate">
              <el-button v-if="scope.row.isAdd" type="text" size="small" @click="handletableData(scope.row, '创建个别化')">添加个别化</el-button>

              <el-popconfirm title="这是一段内容确定删除吗？" class="delete-button" @onConfirm="delhandleClick(scope.row)">
                <el-button type="text" size="small" slot="reference">删除</el-button>
              </el-popconfirm>

              <template v-if="scope.row.isAdd">
                <el-button type="text" size="small" @click="handletableData(scope.row, '编辑产品')">编辑</el-button>
              </template>
              <template v-else>
                <el-button type="text" size="small" @click="handletableData(scope.row, '编辑个别化')">编辑</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="product-pagination">
        <Pagination :pageTotal="pageTotal" :pageSize="pageSize" :pageNum="pageNum" @changepage="changepage" />
      </el-col>
    </el-row>
    <!-- 弹窗区域 -->
    <ProductDialog :dialogObj="ProductData" @reSwitch="reProductSwitch" @reData="reData" />
    <IndividuationDialog :dialogObj="IndividuationData" @reSwitch="reIndividuationSwitch" />
  </div>
</template>
<script>
import IndividuationDialog from './commonDialog/Individuation'
import ProductDialog from './commonDialog/Product'
import Pagination from '../Common/Pagination'
import ProductCategoryApi from '../../../api/ProductBase/ProductCategory'

export default {
  data() {
    return {
      // 列表
      tableLoading: false,
      tableData: [],
      treeprops: {
        hasChildren: 'leaf'
      },
      IndividuationData: {
        switch: false
      },
      ProductData: {
        switch: false
      },
      pageTotal: 0,
      pageSize: 50,
      pageNum: 1,

      maps: []
    };
  },
  mounted () {
    this.init('', '', '')
  },
  components: {
    IndividuationDialog,
    ProductDialog,
    Pagination
  },
  methods: {
    async getProductList (filter = '', productLabelList, industryLabelList, limit, page) {
      const res = await ProductCategoryApi.getProductList(filter, productLabelList, industryLabelList, limit, page)
      return res
    },
    async init (filter, productLabelList, industryLabelList) {
      this.isTable = false
      this.tableLoading = true
      this.tableData = []
      let limit = this.pageSize, page = this.pageNum
      try {
        const res = await this.getProductList(filter, productLabelList, industryLabelList, limit, page)
        res.data.forEach(item => {
          this.tableData.push({
            name: item.Title,
            keyword: item.KeyWord,
            desc: item.ShortDesc,
            parentKeyWord: item.ParentKeyWord,
            image: item.Image,
            leaf: item.leaf === 'false' ? true : false,
            operate: true,
            isAdd: true
          })
        })
        this.pageTotal = res.total
        this.isTable = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.tableLoading = false
          }, 250)
        })
      } catch (error) {
        this.openMessage('获取行业种类列表失败', 'error')
      }
    },
    async tableLoad(tree, treeNode, resolve) {
      let rdata = [], productKeyword = tree.keyword, parentIndividuationKeyword = ''
      let operate = true, leaf = true
      try {
        const res = await ProductCategoryApi.getIndividuationList(productKeyword, parentIndividuationKeyword)
        res.data.forEach(item => {
          // 行业一级
          if (treeNode.level === 0) {
            operate = false
            leaf = true
            // 行业二级
          } else if (treeNode.level === '') {
            operate = true
            leaf = false
          }
          rdata.push({
            name: item.Code,
            keyword: item.Keyword,
            leaf,
            operate,
            isAdd: false
          })
        })
      } catch (error) {
        this.openMessage('获取行业种类列表失败', 'error')
      }
      this.maps.push({
        id: tree.keyword,
        child: [...rdata]
      })
      resolve(rdata)
    },
    // 删除产品、个别化
    async delhandleClick (row) {
      let ProjectKeyword = row.keyword, sureDel = true
      try {
        const res = await ProductCategoryApi.delProject(ProjectKeyword, sureDel)
        if (res.success) {
          this.openMessage('删除产品种类成功', 'success')
          let filter = '', productLabelList = ''
          await this.init(filter, productLabelList)
        } else {
          this.openMessage(res.msg, 'error')
        }
      } catch (error) {
        this.openMessage('删除产品种类失败', 'error')
      }
    },
    // 创建产品弹窗
    handleAddData (title) {
      let label = ''
      if (title === '创建产品') label = 'ProductData'
      this[label].switch = true
      this[label].title = title
      // this[label].data = {}
      this[label].status = 'add'
    },
    // 编辑产品, 创建、编辑、个别化弹窗
    handletableData (row, title) {
      let label = ''
      if (title === '编辑产品') label = 'ProductData'
      else if (title === '创建个别化') label = 'IndividuationData'
      else if (title === '编辑个别化') label = 'IndividuationData'
      this[label].switch = true
      this[label].title = title
      this[label].data = row
      this[label].status = title === '创建个别化' ? 'add' : 'edit'
    },
    openMessage (message, type) {
      this.$message({ message, type})
    },
    // 分页功能 - 返回页数
    changepage (num) {
      console.log(num)
    },
    reProductSwitch () {
      this.ProductData.switch = false
    },
    reIndividuationSwitch () {
      this.IndividuationData.switch = false
    },
    reData () {
      let filter = '', productLabelList = ''
      this.init(filter, productLabelList)
    }
  }
}
</script>
<style lang='scss' scoped>
@import "../scss/Common";
</style>
