<template>
  <div id='requirementSelect'>
    <el-collapse v-model='activeName' accordion>
    <el-collapse-item name='pannel'>
      <template slot="title">
        <div class='search-header'>
          <div class='search' @click.stop>
            <el-input maxlength='500px' placeholder="搜一搜，找得更快" v-model="searchInput" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click.stop='addSearchTag(searchInput)'></el-button>
            </el-input>
          </div>
          <div class='toggleSelect'>
            <el-button @click.stop='clickToggle'>
              <span v-show='filterToggle'>收起筛选<i class="el-icon-arrow-up"></i></span>
              <span v-show='!filterToggle'>展开筛选<i class="el-icon-arrow-down"></i></span>
            </el-button>
          </div>
        </div>
      </template>
      <div class='select'>
        <selectRow
          :selectionCount='6'
          label='产品'
          :selection='productCategory'
          @selectHandle='productSelectHandle'
          :selected='productSelected'
        />
        <selectRow
          :selectionCount='6'
          label='行业'
          :moreLoading='moreLoading'
          :selection='industryCategory'
          @selectHandle='industrySelectHandle'
          :selected='industrySelected'
          :moreSelection='moreSelection'
          :moreSelectionSelected='moreSelectionSelected'
          @moreSelectionSelectHandle='moreSelectionSelectHandle'
        />
      </div>
      <div class='selected-selection'>
        <!-- 显示选中了的条件 -->
          <label>条件：</label>
          <ul>
            <!-- 搜索的tag -->
            <li v-show='searchSelected.length > 0'>
              <el-tag disable-transitions @close='addSearchTag("")' :key='searchSelected' closable type='info' hit color='white' size='mini'>{{ searchSelected }}</el-tag>
            </li>
            <!-- 选择的产品tag -->
            <li v-show='tagControl(productSelected)'>
              <el-tag disable-transitions @close='productSelectHandle(productSelected)' :key='productSelected.Keyword' closable type='info' hit color='white' size='mini'>{{ productSelected.Code }}</el-tag>
            </li>
            <!-- 选择的行业的tag -->
            <li v-show='tagControl(industrySelected)'>
              <el-tag disable-transitions @close='industrySelectHandle(industrySelected)' :key='industrySelected.Keyword' closable type='info' hit color='white' size='mini'>{{ industrySelected.Code }}</el-tag>
            </li>
            <!-- 行业子分类的tag -->
            <li v-show='tagControl(moreSelectionSelected)'>
              <el-tag disable-transitions @close='moreSelectionSelectHandle(moreSelectionSelected)' :key='moreSelectionSelected.Keyword' closable type='info' hit color='white' size='mini'>{{ moreSelectionSelected.Code }}</el-tag>
            </li>
          </ul>
      </div>
    </el-collapse-item>
</el-collapse>



  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import selectRow from './requirementSelect/selectRow.vue'

export default {
  name: 'requirementSelect',
  components: {
    selectRow
  },
  data(){
    return {
      searchInput: '',
      filterToggle: true
    }
  },
  computed: {
    ...mapGetters('productLibrary', ['productCategory', 'industryCategory', 'productSelected',
    "industrySelected", 'moreSelection', 'moreSelectionSelected', 'searchSelected', 'moreLoading']),
    // 用来判断tag是否显示，返回字典是否为空
    tagControl(){
      return function(item) {
        return JSON.stringify(item) !== '{}'
      }
    },
    // 用来控制是否收起筛选的
    activeName: {
      get() {
        if(this.filterToggle) {
          return 'pannel'
        } else {
          return ''
        }
      },
      set(v) {
        this.filterToggle = v === 'pannel' ? true: false
      }
    }
  },
  watch: {

  },
  mounted(){
    // 获取产品分类
    this.getProductCategoryList()
    // 获取行业分类
    this.getIndustryCategoryList()
  },
  methods: {
    // 用户搜索tag
    addSearchTag(item) {
      this.$store.dispatch('productLibrary/searchSelect', item)
    },
    // 用户点击了产品分类
    productSelectHandle(item){
      // 将选中的这个，替换productSelected
      this.$store.dispatch('productLibrary/productSelect', item)
    },
    // 用户点击了行业分类
    industrySelectHandle(item) {
      this.$store.dispatch('productLibrary/industrySelect', item)
    },
    // 用户点击了行业分类的子分类
    moreSelectionSelectHandle(item){
      this.$store.dispatch('productLibrary/industryMoreSelectionSelect', item)
    },
    // 获取产品分类
    getProductCategoryList(){
      this.$store.dispatch('productLibrary/getProductCategoryList')
    },
    // 获取行业分类
    getIndustryCategoryList() {
      this.$store.dispatch('productLibrary/getIndustryCategoryList')
    },
    // 用户控制收起/展开筛选点击
    clickToggle() {
      this.filterToggle = !this.filterToggle
    },
  }
}

</script>

<style lang='scss'>
#requirementSelect{
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  i{
    margin-left: 10px;
  }
  .el-collapse{
    border: none;
  }
  .el-collapse-item__arrow {
    display: none;
  }
  .el-collapse-item__header{
    height: unset;
    pointer-events: none;
  }
  .el-collapse-item__content{
    padding-bottom: 0;
  }
  .el-collapse-item__wrap{
    border-bottom: none;
  }
  label{
    color: #C0C0C0;
  }
  ul {
    list-style: none;
    display: flex;
    padding-left: 15px;
    li {
      margin-right: 25px;
    }
  }
  .search-header, .select, .selected-selection{
    border-bottom: solid 1px rgba(0,0,0,0.1);
    width: 100%;
  }
  .select {
    padding-bottom: 10px;
  }
  .search-header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 15px;
    i{
      margin-left: unset;
    }
    .search {
      width: 100%;
      max-width: 400px;
      pointer-events: auto;
    }
    .toggleSelect{
      pointer-events: auto;
    }
  }
  .select>div{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 10px;
    flex-wrap: wrap;
  }
  .select>div>div{
    display: flex;
  }
  .selected-selection{
    display: flex;
    padding: 10px 0;
  }
}
</style>
