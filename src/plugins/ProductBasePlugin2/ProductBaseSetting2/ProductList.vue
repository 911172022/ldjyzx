<!--
 * @Author: CiFong
 * @Date: 2020-04-29 21:13:31
 * @LastEditors: CiFong
 * @LastEditTime: 2020-08-24 12:05:12
 * @Description: 产品列表
 -->
<template>
  <div class="product-list">
    <el-row>
      <el-col :span="24" class="product-top-button">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddData()"
          >增加</el-button
        >
      </el-col>
      <el-col :span="24" class="product-table">
        <el-table
          v-if="isTable"
          :data="tableData"
          style="width: 100%"
          row-key="id"
          border
          lazy
          :load="tableLoad"
          :tree-props="treeprops"
          v-loading="tableLoading"
        >
          <el-table-column prop="title" label="名称" />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope" v-if="scope.row.operate">
              <el-button
                v-if="scope.row.isAdd"
                type="text"
                size="small"
                @click="handletableData(scope.row, '创建个别化')"
                >添加个别化</el-button
              >
              <el-popconfirm
                title="确定删除吗？"
                class="delete-button"
                @onConfirm="delHandle(scope.row)"
              >
                <el-button type="text" size="small" slot="reference">删除</el-button>
              </el-popconfirm>

              <template v-if="scope.row.isAdd">
                <el-button type="text" size="small" @click="handletableData(scope.row, '编辑产品')"
                  >编辑</el-button
                >
              </template>
              <template v-else>
                <el-button
                  type="text"
                  size="small"
                  @click="handletableData(scope.row, '编辑个别化')"
                  >编辑</el-button
                >
              </template>
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
    <!-- 弹窗区域 -->
    <ProductDialog :dialogObj="ProductData" @reSwitch="reProductSwitch" @reData="reProductData" />
    <IndividuationDialog
      :dialogObj="IndividuationData"
      @reSwitch="reIndividuationSwitch"
      @reData="reIndividuationData"
    />
  </div>
</template>
<script>
import IndividuationDialog from "./commonDialog/Individuation";
import ProductDialog from "./commonDialog/Product";
import Pagination from "../Common/Pagination";
import productApi from "../../../api/ProductBase2/product";
import productIndividualityApi from "../../../api/ProductBase2/productIndividuality";

export default {
  data() {
    return {
      // 列表
      tableLoading: false,
      tableData: [],
      treeprops: {
        hasChildren: "leaf"
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
      isTable: true
    };
  },
  mounted() {
    this.init();
  },
  components: {
    IndividuationDialog,
    ProductDialog,
    Pagination
  },
  methods: {
    async getProductList() {
      try {
        let data = [];
        const arr = await productApi.findProduct();
        for (let i in arr) {
          try {
            let { id } = arr[i];
            const arr2 = await productIndividualityApi.findproductIndividuality(id);
            data.push({
              id: arr[i].id,
              title: arr[i].title,
              intro: arr[i].intro,
              productTypeId: arr[i].productTypeId,
              industryId: arr[i].industryId,
              specialityId: arr[i].specialityId,
              brandId: arr[i].brandId,
              Accessories: arr[i].Accessories,
              Hyperlinks: arr[i].Hyperlinks,
              consumerTypeId: arr[i].consumerTypeId,
              leaf: arr2.length > 0 ? true : false,
              operate: true,
              isAdd: true
            });
          } catch (error) {
            return Promise.reject(error);
          }
        }
        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async init() {
      this.isTable = false;
      setTimeout(() => {
        this.isTable = true;
      }, 1);
      this.tableLoading = true;
      this.tableData = [];
      // let limit = this.pageSize,
      //   page = this.pageNum;
      try {
        this.tableData = await this.getProductList();
        // this.pageTotal = res.total;
        this.$nextTick(() => {
          setTimeout(() => {
            this.tableLoading = false;
          }, 100);
        });
      } catch (error) {
        this.openMessage("获取产品列表失败", "error");
      }
    },
    async tableLoad(tree, treeNode, resolve) {
      let rdata = [];
      let operate = true,
        leaf = false;
      try {
        let { id } = tree;
        const data = await productIndividualityApi.findproductIndividuality(id);
        data.forEach(item => {
          rdata.push({
            title: item.title,
            id: `${tree.id}_${item.id}`,
            productManager: item.productManager,
            department: item.department,
            tel: item.tel,
            recommendRate: item.recommendRate,
            price: item.price,
            character: item.character,
            compatibleProducts: item.compatibleProducts,
            productId: item.productId,
            leaf,
            operate,
            isAdd: false
          });
        });
      } catch (error) {
        this.openMessage("获取产品列表失败", "error");
      }
      resolve(rdata);
    },
    // 删除产品、个别化
    async delHandle(row) {
      if (row.isAdd) {
        if (row.leaf) {
          this.openMessage("请先删除个别化", "warning");
        } else this.delProduct(row.id);
      } else {
        let id = row.id.split("_").pop();
        this.delProductIndividuality(id);
      }
    },
    async delProduct(id) {
      try {
        let obj = { id };
        await productApi.delProduct(obj);
        this.openMessage("删除产品成功", "success");
        await this.init();
        return Promise.resolve(true);
      } catch (error) {
        this.openMessage("删除产品失败", "error");
        return Promise.reject(error);
      }
    },
    async delProductIndividuality(id) {
      try {
        let obj = { id };
        await productIndividualityApi.delproductIndividuality(obj);
        this.openMessage("删除产品个性化成功", "success");
        await this.init();
        return Promise.resolve(true);
      } catch (error) {
        this.openMessage("删除产品个性化失败", "error");
        return Promise.reject(error);
      }
    },
    // 创建产品弹窗
    handleAddData() {
      this.ProductData.switch = true;
      this.ProductData.title = "创建产品";
      this.ProductData.status = "add";
    },
    // 编辑产品, 创建、编辑、个别化弹窗
    handletableData(row, title) {
      let label = "";
      if (title === "编辑产品") label = "ProductData";
      else if (title === "创建个别化") label = "IndividuationData";
      else if (title === "编辑个别化") label = "IndividuationData";
      this[label].switch = true;
      this[label].title = title;
      this[label].data = row;
      this[label].status = title === "创建个别化" ? "add" : "edit";
    },
    openMessage(message, type) {
      this.$message({ message, type });
    },
    // 分页功能 - 返回页数
    changepage(num) {
      console.log(num);
    },
    reProductSwitch() {
      this.ProductData.switch = false;
    },
    reIndividuationSwitch() {
      this.IndividuationData.switch = false;
    },
    reProductData() {
      this.init();
    },
    reIndividuationData() {
      this.init();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../scss/Common";
</style>
