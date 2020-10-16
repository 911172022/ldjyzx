<!--
 * @Author: CiFong
 * @Date: 2020-04-29 21:13:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-04-30 11:24:15
 * @Description: 产品种类列表
 -->
<template>
  <div class="product-category">
    <el-row>
      <el-col :span="24" class="product-top-button">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddData">增加</el-button>
      </el-col>
      <el-col :span="24" class="product-table">
        <el-table :data="tableData" border style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="name" label="种类名称" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-popconfirm title="确定删除该产品种类吗？" class="delete-button" @onConfirm="delhandleClick(scope.row)">
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
    <!-- 弹窗 -->
    <el-dialog :title="dialogtTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
      <el-form :model="productCategoryForm" ref="productCategoryForm" :rules="formRules" :label-position="labelPosition" :label-width="labelWidth">
        <el-form-item label="产品种类名称:" prop="name">
          <el-input v-model.trim="productCategoryForm.name" placeholder="请输入产品种类名称" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="resetForm('productCategoryForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('productCategoryForm')">确 定</el-button>
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
      tableLoading: true,
      // 弹窗
      dialogVisible: false,
      dialogtTitle: '添加产品种类',
      dialogType: null,
      productCategoryForm: {
        name: '',
        keyword: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入产品种类名称', trigger: 'blur' }
        ],
      },
      // 弹窗 - 产品表单样式
      labelWidth: '120pR',
      labelPosition: 'right',
      // 分页
      pageTotal: 0,
      pageSize: 30,
      pageNum: 1
    }
  },
  mounted () {
    this.init()
  },
  components: {
    Pagination
  },
  methods: {
    async init () {
      this.tableLoading = true
      this.tableData = []
      try {
        const res = await ProductCategoryApi.getProductCategoryList()
        res.data.forEach(item => {
          this.tableData.push({
            name: item.Code,
            keyword: item.Keyword
          })
        })
        this.pageTotal = res.total
        this.$nextTick(() => {
          setTimeout(() => {
            this.tableLoading = false
          }, 250)
        })
      } catch (error) {
        this.openMessage('获取产品种类列表失败', 'error')
      }
    },
    async delhandleClick (row) {
      let ProjectKeyword = row.keyword, sureDel = true
      try {
        const res = await ProductCategoryApi.delProject(ProjectKeyword, sureDel)
        if (res.success) {
          this.openMessage('删除产品种类成功', 'success')
          await this.init()
        } else {
          this.openMessage(res.msg, 'error')
        }
      } catch (error) {
        this.openMessage('删除产品种类失败', 'error')
      }
    },
    // 添加产品种类弹窗
    handleAddData () {
      this.dialogVisible = true
      this.dialogtTitle = '添加产品种类'
      this.dialogType = 'add'
    },
    // 编辑产品种类弹窗
    handleEditData (row) {
      this.dialogVisible = true
      this.dialogtTitle = '编辑产品种类'
      this.productCategoryForm.keyword = row.keyword
      this.dialogType = 'edit'
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
    // 添加品种类
    async addProduct () {
      let parentKeyword = '', productName = this.productCategoryForm.name
      try {
        const res = await ProductCategoryApi.newProductCategory(parentKeyword, productName)
        if (res.success) {
          this.openMessage('添加产品种类成功', 'success')
          this.resetForm('productCategoryForm')
          await this.init()
        }
      } catch (error) {
        this.openMessage('添加产品种类失败', 'error')
      }
    },
    // 编辑产品种类
    async editProduct () {
      let projectKeyword = this.productCategoryForm.keyword, projectAttrJson = []
      projectAttrJson.push(
        { name: "projectName", value: this.productCategoryForm.name }
      )
      try {
        const res = await ProductCategoryApi.updateProjectAttr(projectKeyword, projectAttrJson)
        if (res.success) {
          this.openMessage('编辑产品种类成功', 'success')
          this.resetForm('productCategoryForm')
          await this.init()
        }
      } catch (error) {
        this.openMessage('编辑产品种类失败', 'error')
      }
    },
    // 弹窗 - 取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.productCategoryForm.keyword = ''
      this.dialogVisible = false
    },
    openMessage (message, type) {
      this.$message({ message, type})
    },
    // 分页功能 - 返回页数
    changepage (num) {
      console.log(num)
    }
  }
}
</script>
<style lang='scss' scoped>
@import "../scss/Common";
</style>
