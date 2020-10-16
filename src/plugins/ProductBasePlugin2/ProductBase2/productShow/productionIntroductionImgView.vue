<!--
 * @Author: CiFong
 * @Date: 2020-08-21 11:55:39
 * @LastEditors: CiFong
 * @LastEditTime: 2020-08-24 15:36:17
 * @Description: 请输入
-->
<template>
  <div>
    <el-dialog
      title="产品图预览"
      :visible.sync="dialogObj.switch"
      :before-close="handleClose"
      append-to-body
      width="40%"
    >
      <el-row :gutter="20">
        <el-col v-for="item in pics" :key="item.id" :span="8">
          <el-image :src="item.imgUrl" style="height: 100%; width:100%" fit="cover"></el-image
        ></el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import productIndividualityApi from "../../../../api/ProductBase2/productIndividuality";
export default {
  name: "productionIntroductionImgView",
  props: {
    dialogObj: {
      type: Object,
      required: true,
      default: () => ({
        switch: false,
        title: "产品图"
      })
    }
  },
  data() {
    return {
      pics: []
    };
  },
  watch: {
    dialogObj: {
      handler(newValue) {
        if (newValue.switch) {
          this.getProductIndividualityPics(newValue.pics);
        }
      },
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.pics = [];
      this.$emit("reSwitch", false);
    },
    async getProductIndividualityPics(arr) {
      this.pics = [];
      for (let i in arr) {
        let id = arr[i];
        try {
          const res = await productIndividualityApi.findProductIndividualityByPic(id);
          let imgUrl = window.URL.createObjectURL(res);
          this.pics.push({
            id: arr[i],
            imgUrl
          });
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
