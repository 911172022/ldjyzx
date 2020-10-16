<template>
  <div id="productDetail">
    <div class="product-card-header">
      <div class="img-wrapper">
        <el-image :src="product.imgUrl" style="height: 100%; width:100%" fit="cover"></el-image>
      </div>
      <div class="title">
        <div>
          {{ product.title }}
        </div>
        <div>
          <label>产品类型：</label>
          {{ product.ProductType }}
        </div>
      </div>
    </div>
    <div class="desc" ref="desc">
      <div class="mask" v-show="!showDescDetailVisible"></div>
      <div :style="descStyle">
        <h1>产品介绍</h1>
        <p>
          {{ product.intro }}
        </p>
        <h1>资料与案例</h1>
        <template v-if="showDocument">
          <div
            class="product-file-preview"
            style="margin-bottom: 5px"
            v-for="(doc, index) in product.Accessories"
            @click="previewFile(doc)"
            :key="`Accessories_${index}`"
          >
            <img :src="fileIconSrc(doc.name)" />
            <span>{{ doc.name }}</span>
          </div>
        </template>
        <div style="margin-bottom: 5px" v-else>
          ——
        </div>
        <h1>超链接</h1>
        <template v-if="showhyperlink">
          <div
            style="margin-bottom: 5px"
            v-for="(item, index) in product.Hyperlinks"
            :key="`Hyperlinks_${index}`"
          >
            <a :href="item.hyperlinkAddr" target="_blank"
              ><span>{{ item.name }}</span></a
            >
          </div>
        </template>
        <div style="margin-bottom: 5px" v-else>
          ——
        </div>
      </div>
      <el-button
        v-show="!showDescDetailVisible"
        class="showDescModeBtn"
        type="primary"
        round
        size="mini"
        @click="showDescDetail"
        >查看更多</el-button
      >
    </div>
    <div class="main-product">
      <businessDetail
        :business="product.productIndividuality"
        v-if="product.productIndividuality.length > 0"
      />
    </div>
  </div>
</template>

<script>
import { BASE_URL } from "../../../../const";
import businessDetail from "./businessDetail.vue";
import UserApi from "../../../../api/services/project";
import UserApi2 from "../../../../api/services/doc";

export default {
  name: "productDetail",
  props: {
    product: {
      type: Object
    }
  },
  components: {
    businessDetail
  },
  data() {
    return {
      showDescDetailVisible: false
    };
  },
  computed: {
    descStyle() {
      if (this.showDescDetailVisible) {
        return "height: auto";
      }
      return "min-height: 50px; max-height: 200px; overflow: hidden;";
    },
    mainProductShowName: {
      get() {
        return this.product.Individuation[0].Keyword;
      },
      set(newValue) {
        return newValue;
      }
    },
    productImage() {
      return `${BASE_URL}/${this.product.Image}`;
    },
    showDocument() {
      if (this.product.Accessories && this.product.Accessories.length > 0) {
        return true;
      }
      return false;
    },
    showhyperlink() {
      if (this.product.Hyperlinks && this.product.Hyperlinks.length > 0) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    let height = this.$refs.desc.offsetHeight;
    if (height > 300) {
      this.showDescDetailVisible = false;
    } else {
      this.showDescDetailVisible = true;
    }
  },
  methods: {
    showDescDetail() {
      this.showDescDetailVisible = true;
    },
    //  用来返回显示文件的图标的链接
    fileIconSrc(fileName) {
      let i = fileName.split(".");
      if (i.length > 1) {
        i = i[i.length - 1].toUpperCase();
        if (
          ["AUDIO", "DLL", "DOC", "JPG", "PDF", "PNG", "PPT", "TXT", "VIDEO", "XLS", "ZIP"].indexOf(
            i
          ) !== -1
        ) {
          return require(`@/assets/table/${i}.png`);
        }
      }
      return require("@/assets/table/currency.png");
    },
    // 跳转文件预览
    async previewFile(doc) {
      // 获取 ProjectKeyWord
      let Keyword = doc.key,
        IgnoreShortCut = "false";
      const res = await UserApi.getProjectPath(Keyword, IgnoreShortCut);
      const ProjectKeyWord = res.data[0].ProjectKeyword;
      //  储存位置
      await UserApi.saveLastProject(ProjectKeyWord);
      this.$router.push({ name: "DocManagement" });
      //  获取列表
      const filterJson = "",
        page = 1,
        limit = 50;
      const res3 = await UserApi2.getDocList(ProjectKeyWord, filterJson, page, limit);
      if (res3.success) {
        let KeywordList = res3.data.filter(item => item.Keyword === Keyword);
        this.$store.commit("PerMessage/ATTACHMENT_MOVE_DOC", KeywordList[0]);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#productDetail {
  color: #666666;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  .product-card-header {
    display: flex;
    max-width: 450px;
    .img-wrapper {
      margin: 10px 30px 10px 5px;
      height: 100px;
      width: 100px;
      border-radius: 10px;
      overflow: hidden;
    }
    .title {
      margin-top: 10px;
      margin-bottom: 15px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .title > div:first-child {
      font-size: 24px;
      font-weight: 600;
      color: black;
    }
    .title > div:last-child {
      color: #666666;
      label {
        color: grey;
      }
    }
  }
  .desc {
    position: relative;
    margin-bottom: 15px;
    p {
      overflow: hidden;
    }
    img {
      width: auto;
      height: auto;
      max-width: 20px;
      max-height: 20px;
      margin-right: 10px;
    }
    .mask {
      position: absolute;
      background: linear-gradient(transparent, white);
      bottom: 0;
      height: 150px;
      width: 100%;
    }
  }
  .product-file-preview {
    cursor: pointer;
  }
}
</style>
<style lang="scss">
#productDetail {
  .desc {
    .el-button {
      // position: absolute;
      // bottom: 20px;
      // left: 50%;
      // transform: translate(-50%, 0);
    }
  }
  .main-product {
    .title {
      font-weight: bold;
      font-size: 15px;
    }
    .el-collapse-item__content {
      padding-bottom: unset;
    }
  }
}
#Product .selected {
  background-color: unset;
}
</style>
