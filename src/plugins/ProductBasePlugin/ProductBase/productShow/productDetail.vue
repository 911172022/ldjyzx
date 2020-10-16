<template>
  <div id='productDetail'>
    <div class='product-card-header'>
      <div class='img-wrapper'>
        <el-image :src='productImage' style='height: 100%; width:100%' fit='cover'></el-image>
      </div>
      <div class='title'>
        <div>
          {{ product.ProductCnName }}
        </div>
        <div>
          <label>产品类型：</label>
          {{ product.ProductCategory[0].Code }}
        </div>
      </div>
    </div>
    <div class='desc'>
      <div class='mask' v-show='!showDescDetailVisible'>
      </div>
      <h1>产品介绍</h1>
      <p :style="descStyle">
        {{ product.ProductDescription }}
      </p>
      <el-button v-show='!showDescDetailVisible' class='showDescModeBtn' type='primary' round size='mini' @click='showDescDetail'>查看更多</el-button>
    </div>
    <div class='main-product' v-if='product.leaf === "false"'>
      <el-collapse v-model="mainProductShowName">
        <el-collapse-item :name="i.Keyword" v-for='i in product.Individuation' :key='i.Keyword'>
          <template slot='title'>
            <span class='title'>{{ i.Code }}</span>
          </template>
          <businessDetail :business='i.Sub' v-if='i.Sub.length > 0'/>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- <div v-else>
      <productionIntroduction :item='product'/>
    </div> -->
  </div>
</template>

<script>
import { BASE_URL } from "../../../../const";
import businessDetail from './businessDetail.vue'
// import productionIntroduction from './productionIntroduction.vue'

export default{
  name: 'productDetail',
  props: {
    product: {
      type: Object,
    }
  },
  components: {
    businessDetail,
    // productionIntroduction
  },
  data(){
    return {
      showDescDetailVisible: false,
    }
  },
  mounted() {
    if(this.product.leaf === "true") {
      this.showDescDetailVisible = true
    }
  },
  computed: {
    descStyle() {
      if(this.showDescDetailVisible) {
        return "height: auto"
      }
      return "min-height: 50px; max-height: 80px;"
    },
    mainProductShowName: {
      get() {
        return this.product.Individuation[0].Keyword
      },
      set(newValue) {
        return newValue
      }
    },
    productImage() {
      return `${BASE_URL}/${this.product.Image}`
    }
  },
  methods: {
    showDescDetail(){
      this.showDescDetailVisible = true
    }
  }
}

</script>

<style lang='scss' scoped>
#productDetail{
  color: #666666;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  .product-card-header{
    display: flex;
    max-width: 450px;
    .img-wrapper{
      margin: 10px 30px 10px 5px;
      height: 100px;
      width: 100px;
      border-radius: 10px;
      overflow: hidden;
    }
    .title{
      margin-top: 10px;
      margin-bottom: 15px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .title>div:first-child{
      font-size: 24px;
      font-weight: 600;
      color: black;
    }
    .title>div:last-child{
      color: #666666;
      label{
        color: grey;
      }
    }
  }
  .desc{
    position: relative;
    margin-bottom: 15px;
    p{
      overflow: hidden;
    }
    .mask{
      position: absolute;
      background: linear-gradient(transparent, white);
      bottom: 14px;
      height: 100px;
      width: 100%;
    }
  }
}
</style>
<style lang='scss'>
#productDetail{
  .desc{
    .el-button{
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%, 0)
    }
  }
  .main-product{
    .title{
      font-weight: bold;
      font-size: 15px;
    }
    .el-collapse-item__content{
      padding-bottom: unset;
    }
  }
}
#Product .selected {
  background-color: unset;
}

</style>
