<template>
  <div id='productShow' v-loading='productShowLoading'>
    <el-row :gutter='20'>
      <el-col :xs='24' :sm='12' :md='8' :lg='8' :xl='6' v-for='item in products' :key='item.key' >
        <productCard :product='item' @checkProductDetail='checkProductDetail'/>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <div class="pagination">
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[12, 24, 36, 48]"
        :page-size='pageSize'
        :page-count='6'
        layout="total, sizes, prev, pager, next, jumper"
        :total="200">
      </el-pagination> -->
      <Pagination
        :pageTotal='total'
        :pageSize='pageSize'
        :pageNum='currentPage'
        @changepage='changePage'
      />
    </div>
    <el-dialog
      title='产品介绍'
      :visible.sync='productDialogVisible'
      width='90%'
      :before-close='handleClose'
    >
    <productDetail v-if='productDetailControl' :product='productDetail'/>
  </el-dialog>
  </div>
</template>

<script>
import productCard from './productShow/productCard.vue'
import { mapGetters } from 'vuex'
import productDetail from './productShow/productDetail.vue'
import Pagination from '../Common/Pagination.vue'
export default {
  name: 'productLibraryShow',
  components: {
    productCard,
    productDetail,
    Pagination,
  },
  data(){
    return {
      productDialogVisible: false,
      currentPage: 1,
      pageSize: 50,
      productDetailControl: false
    }
  },
  mounted() {
    this.getProductList()
  },
  watch: {
    productSelected() {
      // 重设页码
      this.currentPage = 1
      this.getProductList()
    },
    searchSelected() {
      this.currentPage = 1
      this.getProductList()
    },
    industrySelected() {
      this.currentPage = 1
      this.getProductList()
    },
    moreSelectionSelected() {
      this.currentPage = 1
      this.getProductList()
    }
  },
  computed: {
    ...mapGetters('productLibrary', ['products', 'productDetail', "productSelected",
      "industrySelected", 'moreSelectionSelected', "productShowLoading", "searchSelected", "total"]),
    productLabelList() {
      return this.productSelected.Keyword ? this.productSelected.Keyword: ''
    },
    industryLabelList() {
      if(this.moreSelectionSelected.Keyword) {
        return this.moreSelectionSelected.Keyword
      }
      if(this.industrySelected.Keyword) {
        return this.industrySelected.Keyword
      }
      return ''
    }
  },
  methods: {
    checkProductDetail(item){
      this.productDetailControl = false
      this.$store.dispatch('productLibrary/getProduct', item.KeyWord).then(res => {
        console.log(res)
        
        // 打开dialog查看产品详情
        this.productDialogVisible = true
        this.productDetailControl = true
        
      })
    },
    handleClose(){
      this.productDialogVisible = false
    },
    // 页数变更
    changePage(val) {
      this.currentPage = val
      this.getProductList()
    },
    // 获取产品列表
    getProductList(){
      this.$store.dispatch({
        type: 'productLibrary/getProductList',
        filter: this.searchSelected,
        productLabelList: this.productLabelList,
        industryLabelList: this.industryLabelList,
        limit: this.pageSize,
        page: this.currentPage,
      })
    }
  }
}

</script>

<style lang='scss' scoped>
#productShow{
  margin: 20px 5px;
  .pagination{
    text-align: center;
  }
}
</style>

<style lang='scss'>
#productShow{
  .el-dialog{
    max-width: 900px;
    .el-dialog__title{
      font-size: 14px;
      font-weight: bold;
      line-height: 0;
    }
  }
}

</style>
