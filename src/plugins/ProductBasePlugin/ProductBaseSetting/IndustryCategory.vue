<!--
 * @Author: CiFong
 * @Date: 2020-04-29 21:13:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-05-08 17:40:47
 * @Description: 行业种类列表
 -->
<template>
  <div class="industry-category">
    <el-row>
      <el-col :span="24" class="product-top-button">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddData">增加</el-button>
      </el-col>
      <el-col :span="24" class="product-table">
        <el-table
          v-if="isTable"
          v-loading="tableLoading"
          :data="tableData"
          style="width: 100%"
          row-key="keyword"
          border
          lazy
          :load="tableLoad"
          :tree-props="treeprops">
          <el-table-column prop="name" label="种类名称" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-popconfirm title="确定删除该行业种类吗？" class="delete-button" @onConfirm="delhandleClick(scope.row)">
                <el-button type="text" size="small" slot="reference">删除</el-button>
              </el-popconfirm>
              <el-button type="text" size="small" @click="handleEditData(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="product-pagination">
        <Pagination :pageTotal="pageTotal" :pageSize="pageSize" :pageNum="pageNum" @changepage="changepage" />
      </el-col>
    </el-row>
    <el-dialog :title="dialogtTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="handleClose" width="30%">
      <el-form :model="industryCategoryForm" ref="industryCategoryForm" :rules="formRules" :label-position="labelPosition" :label-width="labelWidth">
        <template>
          <el-form-item label="行业种类一级:" prop="value">
            <el-select v-model="industryCategoryForm.value" placeholder="请选择" :disabled="isDisabled">
              <el-option
                v-for="item in IndustryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="行业种类名称:" prop="name">
          <el-input v-model.trim="industryCategoryForm.name" placeholder="请输入行业种类名称" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="resetForm('industryCategoryForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('industryCategoryForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '../Common/Pagination'
import ProductCategoryApi from '../../../api/ProductBase/ProductCategory'

export default {
  data() {
    return {
      // 列表
      tableData: [],
      treeprops: {
        hasChildren: 'leaf'
      },
      tableLoading: true,
      // 弹窗
      dialogVisible: false,
      dialogtTitle: '添加行业种类',
      dialogType: null,
      industryCategoryForm: {
        name: '',
        keyword: '',
        value: ''
      },
      isDisabled: false,
      formRules: {
        name: [
          { required: true, message: '请输入行业种类名称', trigger: 'blur' }
        ],
      },
      // 弹窗 - 行业表单样式
      labelWidth: '120px',
      labelPosition: 'right',
      // 分页
      pageTotal: 0,
      pageSize: 30,
      pageNum: 1,

      IndustryOptions: [],
      maps: [],
      isTable: true
    }
  },
  mounted () {
    this.init()
  },
  components: {
    Pagination
  },
  methods: {
    async getIndustryCategoryList (parentCategoryKeyword = '') {
      const res = await ProductCategoryApi.getIndustryCategoryList(parentCategoryKeyword)
      return res
    },
    async init () {
      this.isTable = false
      this.tableLoading = true
      this.tableData = []
      try {
        const res = await this.getIndustryCategoryList()
        res.data.forEach(item => {
          this.tableData.push({
            name: item.Code,
            keyword: item.Keyword,
            leaf: item.leaf === 'false' ? true : false
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
      let rdata = [], parentCategoryKeyword = tree.keyword
      try {
        const res = await this.getIndustryCategoryList(parentCategoryKeyword)
        res.data.forEach(item => {
          rdata.push({
            name: item.Code,
            keyword: item.Keyword,
            leaf: false
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
    async delhandleClick (row) {
      let ProjectKeyword = row.keyword, sureDel = true
      try {
        const res = await ProductCategoryApi.delProject(ProjectKeyword, sureDel)
        if (res.success) {
          this.openMessage('删除行业种类成功', 'success')
          await this.init()
        } else {
          this.openMessage(res.msg, 'error')
        }
      } catch (error) {
        this.openMessage('删除行业种类失败', 'error')
      }
    },
    // 添加行业种类弹窗
    handleAddData () {
      this.dialogVisible = true
      this.dialogtTitle = '添加行业种类'
      this.dialogType = 'add'
      this.options3()
      this.isDisabled = false
    },
    // 编辑行业种类弹窗
    async handleEditData (row) {
      this.dialogVisible = true
      this.dialogtTitle = '编辑行业种类'
      this.industryCategoryForm.keyword = row.keyword
      this.dialogType = 'edit'
      await this.options3()
      this.isDisabled = true
      if (row.keyword) {
        const isFind = this.IndustryOptions.some(item => item.value === row.keyword)
        if (isFind) {
          this.industryCategoryForm.value = ''
        } else {
          this.maps.forEach(item => {
            item.child.forEach(item2 => {
              if (item2.keyword === row.keyword)
              return this.industryCategoryForm.value = item.id
            })
          })
        }
      }
    },
    // 弹窗 - 行业一级下拉选单
    async options3 () {
      this.IndustryOptions = []
      this.IndustryOptions.push({
        value: '',
        label: '无'
      })
      const res = await this.getIndustryCategoryList()
      res.data.forEach(item => {
        this.IndustryOptions.push({
          value: item.Keyword,
          label: item.Code
        })
      })
    },
    // 弹窗 - 确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') this.addProduct()
          else if (this.dialogType === 'edit') this.editProduct()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加行业种类
    async addProduct () {
      let parentKeyword = this.industryCategoryForm.value, industryName = this.industryCategoryForm.name
      try {
        const res = await ProductCategoryApi.newIndustryCategory(parentKeyword, industryName)
        if (res.success) {
          this.openMessage('添加行业种类成功', 'success')
          this.resetForm('industryCategoryForm')
          await this.init()
        }
      } catch (error) {
        this.openMessage('添加行业种类失败', 'error')
      }
    },
    // 编辑行业种类
    async editProduct () {
      let projectKeyword = this.industryCategoryForm.keyword, projectAttrJson = []
      projectAttrJson.push(
        { name: "projectName", value: this.industryCategoryForm.name }
      )
      try {
        const res = await ProductCategoryApi.updateProjectAttr(projectKeyword, projectAttrJson)
        if (res.success) {
          this.openMessage('编辑行业种类成功', 'success')
          this.resetForm('industryCategoryForm')
          await this.init()
        }
      } catch (error) {
        this.openMessage('编辑行业种类失败', 'error')
      }
    },
    // 弹窗 - 取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.industryCategoryForm.keyword = ''
      this.dialogVisible = false
    },
    handleClose () {
      this.resetForm('industryCategoryForm')
    },
    openMessage (message, type) {
      this.$message({ message, type})
    },
    // 分页功能 - 返回页数
    changepage (num) {
      console.log(num)
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../scss/Common";
</style>
