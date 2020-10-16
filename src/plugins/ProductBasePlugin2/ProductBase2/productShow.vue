<template>
  <div id="productShow" v-loading="productShowLoading">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" v-for="item in products" :key="item.id">
        <productCard :product="item" @checkProductDetail="checkProductDetail" />
      </el-col>
    </el-row>
    <!-- 分页 -->
    <!-- <div class="pagination">
      <Pagination
        :pageTotal="total"
        :pageSize="pageSize"
        :pageNum="currentPage"
        @changepage="changePage"
      />
    </div> -->
    <!-- 弹窗 -->
    <el-dialog
      title="产品介绍"
      :visible.sync="productDialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <productDetail v-if="productDetailControl" :product="productDetail" />
    </el-dialog>
  </div>
</template>

<script>
import productCard from "./productShow/productCard.vue";
import { mapGetters } from "vuex";
import productDetail from "./productShow/productDetail.vue";
// import Pagination from "../Common/Pagination.vue";
export default {
  name: "productLibraryShow",
  components: {
    productCard,
    productDetail,
    // Pagination
  },
  data() {
    return {
      productDialogVisible: false,
      currentPage: 1,
      pageSize: 50,
      productDetailControl: false
    };
  },
  watch: {
    search() {
      if (this.search) {
        this.currentPage = 1;
        // this.getProductList();
      }
    }
  },
  computed: {
    ...mapGetters("productLibrary2", [
      "searchSelected",
      "productTypeSelected",
      "industrySelected",
      "specialitySelected",
      "brandSelected",
      "consumerTypeSelected",

      "products",
      "productDetail",
      "productShowLoading",
      "total"
    ]),
    productLabelList() {
      return this.productTypeSelected.Keyword ? this.productTypeSelected.Keyword : "";
    },
    search() {
      let searchSelected = this.searchSelected;
      let productTypeSelected = Object.keys(this.productTypeSelected).length !== 0;
      let industrySelected = Object.keys(this.industrySelected).length !== 0;
      let specialitySelected = Object.keys(this.specialitySelected).length !== 0;
      let brandSelected = Object.keys(this.brandSelected).length !== 0;
      let consumerTypeSelected = Object.keys(this.consumerTypeSelected).length !== 0;
      if (
        searchSelected ||
        productTypeSelected ||
        industrySelected ||
        specialitySelected ||
        brandSelected ||
        consumerTypeSelected
      ) {
        this.getProductList();
        return true;
      } else if (
        !searchSelected &&
        !productTypeSelected &&
        !industrySelected &&
        !specialitySelected &&
        !brandSelected &&
        !consumerTypeSelected
      ) {
        this.getProductList();
        return true;
      }
      return false;
    }
  },
  methods: {
    checkProductDetail(item) {
      this.productDetailControl = false;
      this.$store.dispatch("productLibrary2/getProduct", item).then(() => {
        // 打开dialog查看产品详情
        this.productDialogVisible = true;
        this.productDetailControl = true;
      });
    },
    handleClose() {
      this.productDialogVisible = false;
    },
    // 页数变更
    changePage(val) {
      this.currentPage = val;
      this.getProductList();
    },
    // 获取产品列表
    // getProductList() {
    //   // this.$store.dispatch("productLibrary2/getProductList");
    // },
    // 获取产品列表
    getProductList() {
      this.$store.dispatch({
        type: "productLibrary2/getProductList",
        searchSelected: this.searchSelected,
        productTypeId: this.productTypeSelected.id,
        industryId: this.industrySelected.id,
        specialityId: this.specialitySelected.id,
        brandId: this.brandSelected.id,
        consumerTypeId: this.consumerTypeSelected.id
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#productShow {
  margin: 20px 5px;
  .pagination {
    text-align: center;
  }
}
</style>

<style lang="scss">
#productShow {
  .el-dialog {
    max-width: 900px;
    .el-dialog__title {
      font-size: 14px;
      font-weight: bold;
      line-height: 0;
    }
  }
}
</style>
