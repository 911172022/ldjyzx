<!--
 * @Author: CiFong
 * @Date: 2020-04-29 21:13:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-30 11:30:15
 * @Description: 产品种类列表
 -->
<template>
  <div class="product-category">
    <el-row>
      <el-col :span="24" class="product-top-button">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddData"
          >增加</el-button
        >
      </el-col>
      <el-col :span="24" class="product-table">
        <el-table :data="tableData" border style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="name" label="种类名称" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-popconfirm
                title="确定删除该产品种类吗？"
                class="delete-button"
                @onConfirm="delProduct(scope.row)"
              >
                <el-button type="text" size="small" slot="reference">删除</el-button>
              </el-popconfirm>
              <el-button type="text" size="small" @click="handleEditData(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="product-pagination">
        <Pagination
          :pageTotal="pageTotal"
          :pageSize="pageSize"
          :pageNum="pageNum"
          @changepage="changepage"
        />
      </el-col>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog
      :title="dialogtTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form
        :model="productTypeForm"
        ref="productTypeForm"
        :rules="formRules"
        :label-position="labelPosition"
        :label-width="labelWidth"
      >
        <el-form-item label="产品种类名称:" prop="name">
          <el-input v-model.trim="productTypeForm.name" placeholder="请输入产品种类名称" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="resetForm('productTypeForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('productTypeForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "../Common/Pagination";
import productTypeApi from "../../../api/ProductBase2/productType";

export default {
  data() {
    return {
      // 列表
      tableData: [],
      tableLoading: true,
      // 弹窗
      dialogVisible: false,
      dialogtTitle: "添加产品种类",
      dialogType: null,
      productTypeForm: {
        name: "",
        id: ""
      },
      formRules: {
        name: [{ required: true, message: "请输入产品种类名称", trigger: "blur" }]
      },
      // 弹窗 - 产品表单样式
      labelWidth: "120pR",
      labelPosition: "right",
      // 分页
      pageTotal: 0,
      pageSize: 30,
      pageNum: 1
    };
  },
  mounted() {
    this.init();
  },
  components: {
    Pagination
  },
  methods: {
    async init() {
      this.tableLoading = true;
      this.tableData = [];
      try {
        const data = await productTypeApi.findProductType();
        data.forEach(item => {
          this.tableData.push({
            name: item.name,
            id: item.id
          });
        });
        // this.pageTotal = res.total;
        this.$nextTick(() => {
          setTimeout(() => {
            this.tableLoading = false;
          }, 250);
        });
      } catch (error) {
        this.openMessage("获取产品种类列表失败", "error");
      }
    },
    // 添加产品种类弹窗
    handleAddData() {
      this.dialogVisible = true;
      this.dialogtTitle = "添加产品种类";
      this.dialogType = "add";
    },
    // 编辑产品种类弹窗
    handleEditData(row) {
      this.dialogVisible = true;
      this.dialogtTitle = "编辑产品种类";
      this.productTypeForm.id = row.id;
      this.dialogType = "edit";
    },
    // 弹窗 - 确定
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogType === "add") this.addProduct();
          else if (this.dialogType === "edit") this.editProduct();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加品种类
    async addProduct() {
      let data = {
        name: this.productTypeForm.name
      };
      try {
        await productTypeApi.addProductType(data);
        this.openMessage("添加产品种类成功", "success");
        this.resetForm("productTypeForm");
        await this.init();
      } catch (error) {
        this.openMessage("添加产品种类失败", "error");
      }
    },
    // 编辑产品种类
    async editProduct() {
      let data = {
        name: this.productTypeForm.name,
        id: this.productTypeForm.id
      };
      try {
        await productTypeApi.editProductType(data);
        this.openMessage("编辑产品种类成功", "success");
        this.resetForm("productTypeForm");
        await this.init();
      } catch (error) {
        this.openMessage("编辑产品种类失败", "error");
      }
    },
    // 删除产品种类
    async delProduct(row) {
      let data = {
        id: row.id
      };
      try {
        await productTypeApi.delProductType(data);
        this.openMessage("删除产品种类成功", "success");
        await this.init();
      } catch (error) {
        this.openMessage("删除产品种类失败", "error");
      }
    },
    // 弹窗 - 取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.productTypeForm.keyword = "";
      this.dialogVisible = false;
    },
    openMessage(message, type) {
      this.$message({ message, type });
    },
    // 分页功能 - 返回页数
    changepage(num) {
      console.log(num);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../scss/Common";
</style>
