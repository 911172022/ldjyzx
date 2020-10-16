<template>
<div id='businessDetail'>
  <el-collapse v-model='pannel' accordion>
    <el-collapse-item v-for='i in business' :key="i.Keyword" :name='i.Keyword'>
      <template slot="title">
        <div class='business-header'>
          <span class='title'>{{ i.Code }}</span>
          <span class='star'>
            <span v-for='(star, index2) in starRange(parseInt(i.Recommended))' :key='index2 + "12"' class='el-icon-star-on recommend'>
            </span>
            <span v-for='(star, index2) in starRange(5 - parseInt(i.Recommended))' :key='index2 + "22"' class='el-icon-star-on unrecommend'></span>
          </span>
        </div>
      </template>
      <productionIntroduction :item='i'></productionIntroduction>
    </el-collapse-item>
  </el-collapse>
</div>
</template>

<script>
import productionIntroduction from './productionIntroduction.vue'
export default {
  name: 'businessDetail',
  props: {
    business: {
      type: Array,
    }
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  components: {
    productionIntroduction
  },
  computed: {
    pannel: {
      get() {
        if(this.business.length > 0) {
          return this.business[0].Keyword
        }
        return ''
      },
      set(v) {
        return v
      }
    }
  },
  methods: {
    // 返回用来循环推荐星数的数组
    starRange(num){
      if(num) {
        return [...Array(num).keys()]
      }
      return 5
    },
  }
}

</script>

<style lang='scss' scoped>
#businessDetail{
  margin: 0px 20px;
  .business-header{
    display: flex;
    width: 100%;
    padding-right: 30px;
    flex-direction: row;
    justify-content: space-between;
    .recommend{
      font-size: 18px;
      color: #FFC730;
    }
    .unrecommend{
      font-size: 18px;
      color: rgba(0,0,0,0.1)
    }
  }
}

</style>

<style lang='scss'>
#businessDetail{
  color: #666666;
  .el-collapse-item__content{
    color: unset;
  }
  .el-collapse>.el-collapse-item:last-child .el-collapse-item__header{
    border-bottom: none;
  }
}

</style>
