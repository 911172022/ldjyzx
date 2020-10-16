<template>
  <div id="requirementSelect">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="pannel">
        <template slot="title">
          <div class="search-header">
            <div class="search" @click.stop @keyup.enter="stopProp">
              <el-input
                maxlength="500px"
                placeholder="搜一搜，找得更快"
                v-model="searchInput"
                class="input-with-select"
                @keyup.enter.native="addSearchTag(searchInput)"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click.stop="addSearchTag(searchInput)"
                ></el-button>
              </el-input>
            </div>
            <div class="toggleSelect">
              <el-button @click.stop="clickToggle">
                <span v-show="filterToggle">收起筛选<i class="el-icon-arrow-up"></i></span>
                <span v-show="!filterToggle">展开筛选<i class="el-icon-arrow-down"></i></span>
              </el-button>
            </div>
          </div>
        </template>
        <div class="select">
          <selectRow
            :selectionCount="10"
            label="产品"
            :selection="productType"
            @selectHandle="productTypeSelectHandle"
            :selected="productTypeSelected"
          />
        </div>
        <div class="select">
          <selectRow
            :selectionCount="10"
            label="行业"
            :selection="industry"
            @selectHandle="industrySelectHandle"
            :selected="industrySelected"
          />
        </div>
        <div class="select">
          <selectRow
            :selectionCount="10"
            label="专业"
            :selection="speciality"
            @selectHandle="specialitySelectHandle"
            :selected="specialitySelected"
          />
        </div>
        <div class="select">
          <selectRow
            :selectionCount="10"
            label="品牌"
            :selection="brand"
            @selectHandle="brandSelectHandle"
            :selected="brandSelected"
          />
        </div>
        <div class="select">
          <selectRow
            :selectionCount="10"
            label="客户"
            :selection="consumerType"
            @selectHandle="consumerTypeSelectHandle"
            :selected="consumerTypeSelected"
          />
        </div>
        <div class="selected-selection">
          <!-- 显示选中了的条件 -->
          <label>条件：</label>
          <ul>
            <!-- 搜索的tag -->
            <li v-show="searchSelected.length > 0">
              <el-tag
                disable-transitions
                @close="addSearchTag('')"
                :key="searchSelected"
                closable
                type="info"
                hit
                color="white"
                size="mini"
                >标题: {{ searchSelected }}</el-tag
              >
            </li>
            <!-- 选择产品分类tag -->
            <li v-show="tagControl(productTypeSelected)">
              <el-tag
                disable-transitions
                @close="productTypeSelectHandle(productTypeSelected)"
                :key="productTypeSelected.id"
                closable
                type="info"
                hit
                color="white"
                size="mini"
                >{{ productTypeSelected.name }}</el-tag
              >
            </li>
            <!-- 选择行业分类tag -->
            <li v-show="tagControl(industrySelected)">
              <el-tag
                disable-transitions
                @close="industrySelectHandle(industrySelected)"
                :key="industrySelected.id"
                closable
                type="info"
                hit
                color="white"
                size="mini"
                >{{ industrySelected.name }}</el-tag
              >
            </li>
            <!-- 选择专业分类tag -->
            <li v-show="tagControl(specialitySelected)">
              <el-tag
                disable-transitions
                @close="specialitySelectHandle(specialitySelected)"
                :key="specialitySelected.id"
                closable
                type="info"
                hit
                color="white"
                size="mini"
                >{{ specialitySelected.name }}</el-tag
              >
            </li>
            <!-- 选择品牌分类tag -->
            <li v-show="tagControl(brandSelected)">
              <el-tag
                disable-transitions
                @close="brandSelectHandle(brandSelected)"
                :key="brandSelected.id"
                closable
                type="info"
                hit
                color="white"
                size="mini"
                >{{ brandSelected.name }}</el-tag
              >
            </li>
            <!-- 选择客户分类tag -->
            <li v-show="tagControl(consumerTypeSelected)">
              <el-tag
                disable-transitions
                @close="consumerTypeSelectHandle(consumerTypeSelected)"
                :key="consumerTypeSelected.id"
                closable
                type="info"
                hit
                color="white"
                size="mini"
                >{{ consumerTypeSelected.name }}</el-tag
              >
            </li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import selectRow from "./requirementSelect/selectRow.vue";
import { format } from "../../../util/Time";

export default {
  name: "requirementSelect",
  components: {
    selectRow
  },
  data() {
    return {
      searchInput: "",
      filterToggle: true
    };
  },
  computed: {
    ...mapGetters("productLibrary2", [
      "searchSelected",
      "productType",
      "productTypeSelected",
      "industry",
      "industrySelected",
      "speciality",
      "specialitySelected",
      "brand",
      "brandSelected",
      "consumerType",
      "consumerTypeSelected"
    ]),
    // 用来判断tag是否显示，返回字典是否为空
    tagControl() {
      return function(item) {
        return JSON.stringify(item) !== "{}";
      };
    },
    // 用来控制是否收起筛选的
    activeName: {
      get() {
        if (this.filterToggle) {
          return "pannel";
        } else {
          return "";
        }
      },
      set(v) {
        this.filterToggle = v === "pannel" ? true : false;
      }
    }
  },
  watch: {},
  mounted() {
    // let aa = format("2020-07-29T02:25:08.000Z", "yyyy-MM-dd");
    // console.log(new Date().toUTCString());

    // 获取产品种类分类
    this.getProductTypeList();
    // 获取行业分类
    this.getIndustryList();
    // 获取专业分类
    this.getSpecialityList();
    // 获取品牌分类
    this.getBrandList();
    // 获取客户种类分类
    this.getConsumerTypeList();
  },
  methods: {
    stopProp(e) {
      e.stopPropagation();
    },
    // 用户搜索tag
    addSearchTag(item) {
      if (item === "") this.searchInput = "";
      this.$store.dispatch("productLibrary2/searchSelect", item);
    },
    // 用户点击了产品分类
    productTypeSelectHandle(item) {
      // 将选中的这个，替换productTypeSelected
      this.$store.dispatch("productLibrary2/productTypeSelect", item);
    },
    // 用户点击了行业分类
    industrySelectHandle(item) {
      // 将选中的这个，替换industrySelected
      this.$store.dispatch("productLibrary2/industrySelect", item);
    },
    // 用户点击了专业分类
    specialitySelectHandle(item) {
      // 将选中的这个，替换specialitySelected
      this.$store.dispatch("productLibrary2/specialitySelect", item);
    },
    // 用户点击了品牌分类
    brandSelectHandle(item) {
      // 将选中的这个，替换brandSelected
      this.$store.dispatch("productLibrary2/brandSelect", item);
    },
    // 用户点击了客户分类
    consumerTypeSelectHandle(item) {
      // 将选中的这个，替换consumerTypeSelected
      this.$store.dispatch("productLibrary2/consumerTypeSelect", item);
    },

    // 获取产品分类
    getProductTypeList() {
      this.$store.dispatch("productLibrary2/getProductTypeList");
    },
    // 获取行业分类
    getIndustryList() {
      this.$store.dispatch("productLibrary2/getIndustryList");
    },
    // 获取专业分类
    getSpecialityList() {
      this.$store.dispatch("productLibrary2/getSpecialityList");
    },
    // 获取品牌分类
    getBrandList() {
      this.$store.dispatch("productLibrary2/getBrandList");
    },
    // 获取客户种类分类
    getConsumerTypeList() {
      this.$store.dispatch("productLibrary2/getConsumerTypeList");
    },
    // 用户控制收起/展开筛选点击
    clickToggle() {
      this.filterToggle = !this.filterToggle;
    }
  }
};
</script>

<style lang="scss">
#requirementSelect {
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  i {
    margin-left: 10px;
  }
  .el-collapse {
    border: none;
  }
  .el-collapse-item__arrow {
    display: none;
  }
  .el-collapse-item__header {
    height: unset;
    pointer-events: none;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
  label {
    color: #c0c0c0;
  }
  ul {
    list-style: none;
    display: flex;
    padding-left: 15px;
    li {
      margin-right: 25px;
    }
  }
  .search-header,
  .select,
  .selected-selection {
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    width: 100%;
  }
  .select {
    padding-bottom: 10px;
  }
  .search-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 15px;
    i {
      margin-left: unset;
    }
    .search {
      width: 100%;
      max-width: 400px;
      pointer-events: auto;
    }
    .toggleSelect {
      pointer-events: auto;
    }
  }
  .select > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 10px;
    flex-wrap: wrap;
  }
  .select > div > div {
    display: flex;
  }
  .selected-selection {
    display: flex;
    padding: 10px 0;
  }
}
</style>
