<!--
 * @Author: CiFong
 * @Date: 2020-04-30 14:00:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-05-09 10:01:11
 * @Description: 创建、修改个别化弹窗
 -->
<template>
  <div>
    <el-dialog :title="dialogObj.title" :visible.sync="dialogObj.switch" :close-on-click-modal="false" :before-close="handleClose" width="40%">
      <!-- 二级弹窗 - 选择附件 -->
      <SelectAttachment :dialogObj="attachmentData" @reData="reData2" @Attached="attached" />
      <el-form v-loading="formLoading" :element-loading-text="loadingText" :model="individuationForm" ref="individuationForm" :rules="formRules" :label-position="labelPosition" :label-width="labelWidth">
        <el-form-item label="产品经理:" prop="ProductManager">
          <el-input v-model.trim="individuationForm.ProductManager" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="所属部门:" prop="Department">
          <el-input v-model.trim="individuationForm.Department" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="联系电话:" prop="ContactNumber">
          <el-input v-model.trim="individuationForm.ContactNumber" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="推荐指数:" prop="Recommended">
          <el-rate v-model="individuationForm.Recommended" :allow-half="true" style="height: 40px;line-height: 40px;" />
        </el-form-item>
        <el-form-item label="行业种类一级:" prop="primaryIndustryKeyword">
          <el-select v-model="individuationForm.primaryIndustryKeyword" @change="handleIndustryChange" placeholder="请选择" :disabled="isDisabled">
            <el-option
              v-for="item in industryListFirst"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业种类二级:" prop="secondaryIndustryKeyword">
          <el-select v-model="individuationForm.secondaryIndustryKeyword" placeholder="请选择" :disabled="isDisabled">
            <el-option
              v-for="item in industryListSecond"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件价格:" prop="ProductPrice">
          <el-input
            type="textarea"
            :autosize="{ minRows: 1}"
            placeholder="请输入内容"
            v-model="individuationForm.ProductPrice"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品特性:" prop="ProductFeatures">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6}"
            placeholder="请输入内容"
            v-model="individuationForm.ProductFeatures"
          ></el-input>
        </el-form-item>
        <el-form-item label="竞品分析:" prop="ProductComparison">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6}"
            placeholder="请输入内容"
            v-model="individuationForm.ProductComparison"
          ></el-input>
        </el-form-item>
        <el-form-item label="案例:" prop="CaseAttachment">
          <el-button size="small" type="primary" @click="handleAddAttachment('CaseAttachment')">选择文件</el-button>
          <el-table v-if="individuationForm.CaseAttachment.length !== 0" :data="individuationForm.CaseAttachment" style="width: 100%">
            <el-table-column prop="Attachment" label="文件名" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm title="这是一段内容确定删除吗？" class="delete-button"  @onConfirm="delhandleClick(scope.row, 'CaseAttachment')">
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="资料:" prop="AdditionalDocument">
          <el-button size="small" type="primary" @click="handleAddAttachment('AdditionalDocument')">选择文件</el-button>
          <el-table v-if="individuationForm.AdditionalDocument.length !== 0" :data="individuationForm.AdditionalDocument" style="width: 100%">
            <el-table-column prop="Attachment" label="文件名" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm title="这是一段内容确定删除吗？" class="delete-button"  @onConfirm="delhandleClick(scope.row, 'AdditionalDocument')">
                  <el-button type="text" size="small" slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="resetForm('individuationForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('individuationForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ProductCategoryApi from '../../../../api/ProductBase/ProductCategory'
import SelectAttachment from '../../../../components/Dialog/SelectAttachment'

export default {
  name: 'IndividuationDialog',
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: () => ({
        switch: false,
        title: '个别化'
      })
    }
  },
  data() {
    return {
      // 个别化表单样式
      labelWidth: '120px',
      labelPosition: 'right',
      formLoading: false,
      loadingText: '加载中...',
      // 二级弹窗 - 选择附件
      attachmentData: {
        switch: false
      },
      // 个别化表单
      individuationForm: {
        productkeyword: '', // 修改时获取产品 ID
        ProductManager: '', // 产品经理
        Department: '', // 所属部门
        ContactNumber: '', // 联系电话
        Recommended: 0, // 推荐指数
        ProductPrice: '', // 软件价格
        ProductFeatures: '', // 产品特性
        ProductComparison: '', // 竞品分析
        CaseAttachment: [], // 案例
        AdditionalDocument: [], // 资料
        primaryIndustryKeyword: '', // 行业种类一级
        secondaryIndustryKeyword: '', // 行业种类二级
      },
      // 个别化附件状态: CaseAttachment、AdditionalDocument
      attachmentStatus: '',
      formRules: {
        ProductManager: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        Department: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        ContactNumber: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        ProductPrice: [
          { required: true, message: '请输入软件价格', trigger: 'blur' }
        ],
        ProductFeatures: [
          { required: true, message: '请输入产品特性', trigger: 'blur' }
        ],
        ProductComparison: [
          { required: true, message: '请输入竞品分析', trigger: 'blur' }
        ],
        primaryIndustryKeyword: [
          { required: true, message: '请选择行业种类一级', trigger: 'change' }
        ],
        secondaryIndustryKeyword: [
          { required: true, message: '请选择行业种类二级', trigger: 'change' }
        ]
      },
      // 行业一、二级选单修改时禁用
      isDisabled: false,
      // 行业一级列表
      industryListFirst: [],
      // 行业二级列表
      industryListSecond: []
    }
  },
  components: {
    SelectAttachment
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.industryListFirst = []
          this.getIndustryCategoryList()
          if (newValue.status === 'edit') {
            this.isDisabled = true
            this.getindividuationDetail(newValue.data.keyword)
          } else if (newValue.status === 'add') {
            this.isDisabled = false
          }
        }
      },
      deep: true
    }
  },
  methods: {
    // 删除附件
    async delhandleClick (row, status) {
     let index = this.individuationForm[status].findIndex(item => item.Keyword === row.Keyword)
     if (index !== -1) {
       this.individuationForm[status].splice(index, 1)
     }
    },
    // 开启附件弹窗
    handleAddAttachment (status) {
      this.attachmentStatus = status
      this.attachmentData.switch = true
    },
    // 选择附件弹窗 - 返回值
    reData2(e) {
      this.attachmentData.switch = e
    },
    // 选择附件弹窗 - 返回值
    attached(e) {
      let { attachmentStatus } = this
      e.forEach(item => {
        this.individuationForm[attachmentStatus].push({
          ...item,
          Attachment: item.Title
        })
      })
    },
    // 修改 - 获取个别化详情
    async getindividuationDetail (individuationKeyword) {
      this.formLoading = true
      let CaseAttachment = [], AdditionalDocument = []
      try {
        const res = await ProductCategoryApi.getIndividuation(individuationKeyword)
        if (res.data[0].CaseAttachment.length > 0) {
          res.data[0].CaseAttachment.forEach(item => {
            CaseAttachment.push({
              Attachment: item.Code,
              Keyword: item.Keyword
            })
          })
        }
        if (res.data[0].AdditionalDocument.length > 0) {
          res.data[0].AdditionalDocument.forEach(item => {
            AdditionalDocument.push({
              Attachment: item.Code,
              Keyword: item.Keyword
            })
          })
        }
        this.$nextTick(() => {
          this.individuationForm.ProductManager = res.data[0].ProductManagerDesc
          this.individuationForm.Department = res.data[0].Department
          this.individuationForm.ContactNumber = res.data[0].ContactNumber
          this.individuationForm.Recommended = parseFloat(res.data[0].Recommended)
          this.individuationForm.primaryIndustryKeyword = res.data[0].IndustryPrimary[0].Keyword
          this.individuationForm.secondaryIndustryKeyword = res.data[0].IndustrySecondary[0].Keyword
          this.individuationForm.ProductPrice = res.data[0].ProductPrice
          this.individuationForm.ProductFeatures = res.data[0].ProductFeatures
          this.individuationForm.ProductComparison = res.data[0].ProductComparison
          this.individuationForm.CaseAttachment = CaseAttachment
          this.individuationForm.AdditionalDocument = AdditionalDocument
          if (this.individuationForm.secondaryIndustryKeyword) {
            this.getIndustryCategoryList(this.individuationForm.primaryIndustryKeyword)
          }
          this.formLoading = false
        })
      } catch (error) {
        this.openMessage('获取个别化详情失败', 'error')
      }
    },
    // 行业种类一级 change 触发
    handleIndustryChange (keyword) {
      this.individuationForm.secondaryIndustryKeyword = ''
      this.getIndustryCategoryList(keyword)
    },
    // 获取行业一、二级
    async getIndustryCategoryList (parentCategoryKeyword = '') {
      this.industryListSecond = []
      try {
        const res = await ProductCategoryApi.getIndustryCategoryList(parentCategoryKeyword)
        res.data.forEach(item => {
          if (parentCategoryKeyword) {
            this.industryListSecond.push({
              value: item.Keyword,
              label: item.Code
            })
          } else {
            this.industryListFirst.push({
              value: item.Keyword,
              label: item.Code
            })
          }
        })
      } catch (error) {
        this.openMessage('获取行业种类列表失败', 'error')
      }
    },
    // 弹窗 - 确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogObj.status === 'add') this.addIndividuation()
          else if (this.dialogObj.status === 'edit') this.editIndividuation()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加个别化
    async addIndividuation () {
      let productKeyword = this.dialogObj.data.keyword, { primaryIndustryKeyword, secondaryIndustryKeyword } = this.individuationForm, attrJson = []
      let CaseAttachment = this.individuationForm.CaseAttachment.map(item => item.Keyword).join(',')
      let AdditionalDocument = this.individuationForm.AdditionalDocument.map(item => item.Keyword).join(',')
      attrJson.push(
        { name: 'ProductManager', value: this.individuationForm.ProductManager},
        { name: 'Department', value: this.individuationForm.Department},
        { name: 'ContactNumber', value: this.individuationForm.ContactNumber},
        { name: 'Recommended', value: this.individuationForm.Recommended},
        { name: 'ProductPrice', value: this.individuationForm.ProductPrice},
        { name: 'ProductFeatures', value: this.individuationForm.ProductFeatures},
        { name: 'ProductComparison', value: this.individuationForm.ProductComparison},
        { name: 'CaseAttachment', value: CaseAttachment},
        { name: 'AdditionalDocument', value: AdditionalDocument}
        )
      try {
        const res = await ProductCategoryApi.newIndividuation(productKeyword, primaryIndustryKeyword, secondaryIndustryKeyword, attrJson)
        if (res.success) {
          this.openMessage('添加行业种类成功', 'success')
          this.resetForm('individuationForm')
        }
      } catch (error) {
        this.openMessage('添加行业种类失败', 'error')
      }
    },
    // 编辑个别化
    async editIndividuation () {
      let individuationKeyword = this.dialogObj.data.keyword, attrJson = [], { primaryIndustryKeyword, secondaryIndustryKeyword } = this.individuationForm
      let CaseAttachment = this.individuationForm.CaseAttachment.map(item => item.Keyword).join(',')
      let AdditionalDocument = this.individuationForm.AdditionalDocument.map(item => item.Keyword).join(',')
      attrJson.push(
        { name: "ProductManager", value: this.individuationForm.ProductManager },
        { name: "Department", value: this.individuationForm.Department },
        { name: "ContactNumber", value: this.individuationForm.ContactNumber },
        { name: "Recommended", value: this.individuationForm.Recommended },
        { name: "ProductPrice", value: this.individuationForm.ProductPrice },
        { name: "ProductFeatures", value: this.individuationForm.ProductFeatures },
        { name: "ProductComparison", value: this.individuationForm.ProductComparison },
        { name: "CaseAttachment", value: CaseAttachment },
        { name: "AdditionalDocument", value: AdditionalDocument }
      )
      try {
        // 这接口不能修改行业一级、二级 要后端改
        const res = await ProductCategoryApi.updateIndividuation(individuationKeyword, primaryIndustryKeyword, secondaryIndustryKeyword, attrJson)
        if (res.success) {
          this.openMessage('编辑个别化成功', 'success')
          this.resetForm('individuationForm')
        }
      } catch (error) {
        this.openMessage('编辑个别化失败', 'error')
      }
    },
    // 重置表单、回传父组件开关弹窗
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('reSwitch', false)
    },
    // esc、弹窗上方x、取消按钮 触发
    handleClose () {
      this.resetForm('individuationForm')
    },
    openMessage (message, type) {
      this.$message({ message, type})
    },
  }
}
</script>
<style lang='scss' scoped>
</style>
