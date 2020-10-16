<!--
 * @Author: CiFong
 * @Date: 2020-07-28 16:14:35
 * @LastEditors: CiFong
 * @LastEditTime: 2020-07-29 18:05:14
 * @Description: 请输入
-->
<template>
  <div id="productCard" @click="checkProductDetail">
    <div class="product-card-header">
      <div class="img-wrapper">
        <el-image :src="product.imgUrl" style="height: 100%; width:100%" fit="cover"></el-image>
      </div>
      <div class="title">
        {{ product.title }}
      </div>
    </div>
    <div class="desc">
      {{ product.intro }}
    </div>
  </div>
</template>

<script>
export default {
  name: "productCard",
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    checkProductDetail() {
      this.$emit("checkProductDetail", this.product);
    }
  }
};
</script>

<style lang="scss" scoped>
#productCard {
  height: 140px;
  cursor: pointer;
  box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  justify-content: space-between;
  .product-card-header {
    display: flex;
    align-items: center;
    .img-wrapper {
      margin: 10px 25px 10px 5px;
      height: 80px;
      width: 80px;
      border-radius: 10px;
      overflow: hidden;
      border: solid 1px rgba(0, 0, 0, 0.1);
    }
    .title {
      flex: 1;
      font-size: 15px;
      font-weight: 600;
    }
  }
  .desc {
    text-overflow: ellipsis;
    overflow: hidden;
    // white-space: nowrap;
    font-size: 13px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: grey;
  }
}
</style>
