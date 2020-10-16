<!--
 * @Author: CiFong
 * @Date: 2020-04-30 15:46:08
 * @LastEditors: CiFong
 * @LastEditTime: 2020-05-09 10:20:23
 * @Description: 创建、修改产品弹窗
 -->
<template>
  <div>
    <el-dialog :title="dialogObj.title" :visible.sync="dialogObj.switch" :close-on-click-modal="false" :before-close="handleClose" width="40%">
      <el-form v-loading="formLoading" :element-loading-text="loadingText" :model="productForm" ref="productForm" :rules="formRules" :label-position="labelPosition" :label-width="labelWidth">
        <el-form-item label="产品名称:" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="产品介绍:" prop="Description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 4}"
            placeholder="请输入内容"
            v-model="productForm.Description"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品种类:" prop="parentKeyword">
          <el-select v-model="productForm.parentKeyword" placeholder="请选择">
            <el-option
              v-for="item in ProductCategoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品图:" prop="picture">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :http-request="httpRequest"
            :before-upload="beforeAvatarUpload"
            :on-success="onSuccess">
            <img v-if="productForm.picture" :src="productForm.picture" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('productForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ProductCategoryApi from '../../../../api/ProductBase/ProductCategory'
import FileApi from '@/api/services/file'
import { TimeChange } from '@/util/Time'

export default {
  name: 'ProductDialog',
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: () => ({
        switch: false,
        title: '产品',
        status: ''
      })
    }
  },
  data() {
    return {
      // 产品表单样式
      labelWidth: '120px',
      labelPosition: 'right',
      loadingText: '加载中...',
      formLoading: false,
      // 产品表单
      productForm: {
        name: '',
        Description: '',
        parentKeyword: '',
        picture: '',
        keyword: ''
      },
      // 产品表单正则
      formRules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        Description: [
          { required: true, message: '请输入产品介绍', trigger: 'blur' }
        ],
        parentKeyword: [
          { required: true, message: '请选择产品种类', trigger: 'change' }
        ],
      },
      // 产品表单 - 下拉一级产品种类
      ProductCategoryList: [],
      fileName: '',
      ServerFullFileName: '',
      isUploaded: false
    }
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getProductCategoryList()
          if (newValue.status === 'edit') {
            this.formLoading = true
            this.$nextTick(() => {
              this.productForm.name = newValue.data.name
              this.productForm.Description = newValue.data.desc
              this.productForm.picture = newValue.data.image
              this.productForm.parentKeyword = newValue.data.parentKeyWord
              this.productForm.keyword = newValue.data.keyword
              setTimeout(() => {
                this.formLoading = false
              }, 1000)
            })
          }
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取下拉一级产品种类
    async getProductCategoryList () {
      this.ProductCategoryList = []
      try {
        const res = await ProductCategoryApi.getProductCategoryList()
        res.data.forEach(item => {
          this.ProductCategoryList.push({
            value: item.Keyword,
            label: item.Code
          })
        })
      } catch (error) {
        this.openMessage('获取产品种类列表失败', 'error')
      }
    },
    // 弹窗 - 确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogObj.status === 'add') this.addProduct()
          else if (this.dialogObj.status === 'edit') this.editProduct()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加产品
    async addProduct () {
      let parentKeyword = this.productForm.parentKeyword, productCode = this.productForm.name, productAttrJson = []
      productAttrJson.push(
        {name:'ProductCnName', value: this.productForm.name},{name:'ProductDescription', value: this.productForm.Description},{name:'Image', value: this.productForm.picture})
      try {
        const res = await ProductCategoryApi.newProduct(parentKeyword, productCode, productAttrJson)
        if (res.success) {
          this.openMessage('添加产品成功', 'success')
          this.resetForm('productForm')
          this.$emit('reData', true)
        }
      } catch (error) {
        this.openMessage('添加产品失败', 'error')
      }
    },
    // 编辑产品
    async editProduct () {
      let productKeyword = this.productForm.keyword, productCode = this.productForm.name, productAttrJson = [], parentKeyword = this.productForm.parentKeyword
      productAttrJson.push(
        { name: 'ProductDescription', value: this.productForm.Description},
        { name: 'Image', value: this.productForm.picture},
        { name: "CA_ATTRTEMP", value: "NONCOMM", attrtype: "attrData" }
        )
      try {
        const res = await ProductCategoryApi.updateProduct(productKeyword, productCode, productAttrJson, parentKeyword)
        if (res.success) {
          this.openMessage('编辑产品成功', 'success')
          this.resetForm('productForm')
          this.$emit('reData', true)
        }
      } catch (error) {
        this.openMessage('编辑产品失败', 'error')
      }
    },
    // 重置表单、回传父组件开关弹窗
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('reSwitch', false)
    },
    // esc、弹窗上方x、取消按钮 触发
    handleClose () {
      this.formLoading = false
      this.resetForm('productForm')
    },
    openMessage (message, type) {
      this.$message({ message, type})
    },
    async beforeAvatarUpload(file) {
      let fileSize = file.size, ObjectKeyword = '', CreateDate = '',
          ModifyDate = TimeChange(file.lastModifiedDate),
          ServerFileName = `BMP/${file.name}`
      try {
        const res = await FileApi.beforeUploadFile(ObjectKeyword, ServerFileName, CreateDate, ModifyDate, fileSize)
        if (res.success) {
          this.ServerFullFileName = res.data[0].ServerFullFileName
          this.fileName = file.name
        }
      } catch (error) {
        this.onError()
      }
    },
    async httpRequest(file) {
      try {
        let { ServerFullFileName } = this
        const res = await FileApi.uploadFile(ServerFullFileName, file.file)
        if (!res.success) {
          this.openMessage('已上传过此图片', 'warning')
          this.isUploaded = true
        }
      } catch (error) {
        this.onError()
      }
    },
    // 上传文件成功
    async onSuccess() {
      try {
        let DocKeyword = '', { ServerFullFileName } = this
        await FileApi.afterUploadFile(DocKeyword, ServerFullFileName)
        if (!this.isUploaded) {
          this.openMessage('上传成功', 'success')
          this.isUploaded = false
        }
        this.productForm.picture = `BMP/${this.fileName}?timestamp=${Date.now()}`
      } catch (error) {
        this.onError()
      }
    },
    // 上传文件失败
    onError() {
      this.openMessage('上传失败', 'error')
    }
  }
}
</script>
<style lang='scss' scoped>
.avatar-uploader {
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
