<template>
 <div id="addressHorizontalSelect">
  <el-row>
   <el-col
    :span="span">
    <el-select
     size="small"
     v-model="provinceCode"
     @focus="getProvinces"
     @change="changeProvince"
     :placeholder="$t('省')"
     filterable>
     <el-option
      v-for="item in provinceList"
      :key="item.provinceCode"
      :label="item.provinceName"
      :value="item.provinceCode">
     </el-option>
    </el-select>
   </el-col>
   <el-col
    :span="span"
    v-if="!hideCity">
    <el-select
     size="small"
     v-model="cityCode"
     @focus="getCities"
     @change="changeCity"
     :placeholder="$t('市')"
     filterable>
     <el-option
      v-for="item in cityList"
      :key="item.cityCode"
      :label="item.cityName"
      :value="item.cityCode">
     </el-option>
    </el-select>
   </el-col>
   <el-col
    :span="span"
    v-if="!hideCity && !hideArea">
    <el-select
     size="small"
     v-model="areaCode"
     @focus="getAreas"
     @change="changeArea"
     :placeholder="$t('区/县')"
     filterable>
     <el-option
      v-for="item in areaList"
      :key="item.areaCode"
      :label="item.areaName"
      :value="item.areaCode">
     </el-option>
    </el-select>
   </el-col>
  </el-row>
 </div>
</template>
 
<script>
import API from "./api/services/addr";

export default {
 name: 'addressHorizontalSelect',
 
 components: {},
 
 props: {
  hideCity: { // 隐藏市
   type: Boolean,
   default: false
  },
  hideArea: { // 隐藏区/县
   type: Boolean,
   default: false
  },
  addressCode: null // 地址编码
 },
 
 model: {
  prop: 'addressCode',
  event: 'addressSelect'
 },
 
 data() {
  return {
   provinceList: [], // 省份列表
   cityList: [], // 城市列表
   areaList: [], // 区/县列表
   provinceCode: '', // 省份编码
   cityCode: '', // 城市编码
   areaCode: '', // 区/县编码
   cityFlag: false, // 避免重复请求的标志
   provinceFlag: false,
   areaFlag: false
  }
 },
 
 computed: {
  span () {
   if (this.hideCity) {
    return 24
   }
   if (this.hideArea) {
    return 12
   }
   return 8
  }
 },
 
//  watch: {
//  },
 
 created () {
  this.getProvinces()
 },
 
 methods: {
  /**
   * 获取数据
   * @param {Array} array 列表
   * @param {String} url 请求url
   * @param {String} code 编码(上一级编码)
   */
  fetchData (array, url, code) {
   this.$http({
    method: 'get',
    url: url + '/' + code
   })
   .then(res => {
    if (res.data.code === this.API.SUCCESS) {
     let body = res.data.body || []
     array.splice(0, array.length, ...body)
    }
   })
   .catch(err => {
    console.log(err)
   })
   .finally(res => {
   })
  },
  // 根据国家编码获取省份列表
  getProvinces () {
   if (this.provinceFlag) {
    return
   }
   this.fetchData(this.provinceList, this.API.province, 156)
   this.provinceFlag = true
  },
  // 省份修改，拉取对应城市列表
  changeProvince (val) {
   this.fetchData(this.cityList, this.API.city, this.provinceCode)
   this.cityFlag = true
   this.cityCode = ''
   this.areaCode = ''
   this.$emit('addressSelect', val)
  },
  // 根据省份编码获取城市列表
  getCities () {
   if (this.cityFlag) {
    return
   }
   if (this.provinceCode) {
    this.fetchData(this.cityList, this.API.city, this.provinceCode)
    this.cityFlag = true
   }
  },
  // 城市修改，拉取对应区域列表
  changeCity (val) {
   this.fetchData(this.areaList, this.API.area, this.cityCode)
   this.areaFlag = true
   this.areaCode = ''
   this.$emit('addressSelect', val)
  },
  // 根据城市编码获取区域列表
  getAreas () {
   if (this.areaFlag) {
    return
   }
   if (this.cityCode) {
    this.fetchData(this.areaList, this.API.area, this.cityCode)
   }
  },
  // 区域修改
  changeArea (val) {
   this.$emit('addressSelect', val)
  },
  // 重置省市区/县编码
  reset () {
   this.provinceCode = '',
   this.cityCode = '',
   this.areaCode = ''
  },
  // 地址编码转换成省市区列表
  addressCodeToList (addressCode) {
   if (!addressCode) return false
   this.$http({
    method: 'get',
    url: this.API.addressCode + '/' + addressCode
   })
   .then(res => {
    let data = res.data.body
    if (!data) return
    if (data.provinceCode) {
     this.provinceCode = data.provinceCode
     this.fetchData(this.cityList, this.API.city, this.provinceCode)
    } else if (data.cityCode) {
     this.cityCode = data.cityCode
     this.fetchData(this.areaList, this.API.area, this.cityCode)
    } else if (data.areaCode) {
     this.areaCode = data.areaCode
    }
   })
   .finally(res => {
   })
  }
 },
 watch: {
  addressCode: {
   deep: true,
   immediate: true,
   handler (newVal) {
    if (newVal) {
     this.addressCodeToList(newVal)
    } else {
     this.$nextTick(() => {
      this.reset()
     })
    }
   }
  }
 }
}
</script>
 
<style lang="less" scoped>
</style>