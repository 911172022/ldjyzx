import productTypeApi from "../api/ProductBase2/productType";
import industryApi from "../api/ProductBase2/industry";
import specialityApi from "../api/ProductBase2/speciality";
import brandApi from "../api/ProductBase2/brand";
import consumerTypeApi from "../api/ProductBase2/consumerType";

import productApi from "../api/ProductBase2/product";
import productIndividualityApi from "../api/ProductBase2/productIndividuality";

export default {
  namespaced: true,
  state: {
    // 用户搜索的tag
    searchSelected: "",

    // 产品分类
    productType: [],
    // 存放选择了的产品分类
    productTypeSelected: {},
    // 行业分类
    industry: [],
    // 存放选择了的行业分类
    industrySelected: {},
    // 专业分类
    speciality: [],
    // 存放选择了的专业分类
    specialitySelected: {},
    // 品牌分类
    brand: [],
    // 存放选择了的品牌分类
    brandSelected: {},
    // 客户分类
    consumerType: [],
    // 存放选择了的客户分类
    consumerTypeSelected: {},

    // 产品信息列表
    products: [],
    // productShow 产品信息列表展示区域的loading
    productShowLoading: false,
    // 要查看的产品的详细信息
    productDetail: {},
    // 一个xx设计院下边的详细信息
    businessDetail: {},
    // 总条数
    total: 0
  },
  actions: {
    // 用户点击搜查，添加搜查的tag
    searchSelect({ commit }, item) {
      // 虽然叫item，其实只是一个字符串
      commit("SELECT_SEARCH", item);
    },
    // 获取产品分类的列表
    getProductTypeList({ commit }) {
      return new Promise((resolve, reject) => {
        productTypeApi
          .findProductType()
          .then(res => {
            commit("SET_PRODUCT_TYPE_LIST", res);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 用户点击产品分类时
    productTypeSelect({ commit }, item) {
      // 保留
      commit("SELECT_PRODUCT_TYPE", item);
    },
    // 获取行业分类的列表
    getIndustryList({ commit }) {
      return new Promise((resolve, reject) => {
        industryApi
          .findIndustry()
          .then(res => {
            commit("SET_INDUSTRY_LIST", res);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 用户点击行业分类时
    industrySelect({ commit }, item) {
      // 保留
      commit("SELECT_INDUSTRY", item);
    },
    // 获取专业分类的列表
    getSpecialityList({ commit }) {
      return new Promise((resolve, reject) => {
        specialityApi
          .findSpeciality()
          .then(res => {
            commit("SET_SPECIALITY_LIST", res);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 用户点击专业分类时
    specialitySelect({ commit }, item) {
      // 保留
      commit("SELECT_SPECIALITY", item);
    },
    // 获取品牌分类的列表
    getBrandList({ commit }) {
      return new Promise((resolve, reject) => {
        brandApi
          .findBrand()
          .then(res => {
            commit("SET_BRAND_LIST", res);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 用户点击品牌分类时
    brandSelect({ commit }, item) {
      // 保留
      commit("SELECT_BRAND", item);
    },
    // 获取客户分类的列表
    getConsumerTypeList({ commit }) {
      return new Promise((resolve, reject) => {
        consumerTypeApi
          .findConsumerType()
          .then(res => {
            commit("SET_CONSUMER_TYPE_LIST", res);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 用户点击客户分类时
    consumerTypeSelect({ commit }, item) {
      // 保留
      commit("SELECT_CONSUMER_TYPE", item);
    },

    // 用户获取产品列表
    async getProductList({ commit }, payload) {
      commit("SET_PRODUCT_SHOW_LOADING", true);
      try {
        const res = await productApi.findProduct();
        let arr = [...res];
        // commit("SET_TOTAL", res.total);
        if (payload.searchSelected) {
          arr = arr.filter(item => item.title.indexOf(payload.searchSelected) !== -1);
        }
        if (payload.productTypeId) {
          arr = arr.filter(item => item.productTypeId === payload.productTypeId);
        }
        if (payload.industryId) {
          arr = arr.filter(item => item.industryId === payload.industryId);
        }
        if (payload.specialityId) {
          arr = arr.filter(item => item.specialityId === payload.specialityId);
        }
        if (payload.brandId) {
          arr = arr.filter(item => item.brandId === payload.brandId);
        }
        if (payload.consumerTypeId) {
          arr = arr.filter(item => item.consumerTypeId === payload.consumerTypeId);
        }
        for (let i in arr) {
          try {
            const imgUrl = await productApi.findProductIconByFile(arr[i].id);
            arr[i].imgUrl = window.URL.createObjectURL(imgUrl);
          } catch (error) {
            return Promise.reject(error);
          }
        }
        commit("SET_PRODUCTS", arr);
        commit("SET_PRODUCT_SHOW_LOADING", false);
        return Promise.resolve(arr);
      } catch (error) {
        commit("SET_PRODUCT_SHOW_LOADING", false);
        return Promise.reject(error);
      }
    },
    // 获取产品信息和行业个性化（目录）
    async getProduct({ commit }, productData) {
      commit("SET_PRODUCT_SHOW_LOADING", true);
      try {
        const res = await productIndividualityApi.findproductIndividuality(productData.id);
        let arr = [];
        for (let i in res) {
          try {
            const pics = await productIndividualityApi.findProductIndividualityByPid(res[i].id);
            arr.push({
              ...res[i],
              pics
            });
          } catch (error) {
            return Promise.reject(error);
          }
        }
        commit("SET_PRODUCT_DETAIL", { productData, arr });
        commit("SET_PRODUCT_SHOW_LOADING", false);
      } catch (error) {
        commit("SET_PRODUCT_SHOW_LOADING", false);
        return Promise.reject(error);
      }
    }
  },
  mutations: {
    // 用户点击搜索，添加搜索tag
    SELECT_SEARCH(state, item) {
      state.searchSelected = item;
      // 其它选择了的全清掉
      // state.productTypeSelected = {};
      // state.industrySelected = {};
      // state.specialitySelected = {};
      // state.brandSelected = {};
      // state.consumerTypeSelected = {};
    },
    // 用户点击了产品分类，在mutation中判断增加tag还是去掉tag
    SELECT_PRODUCT_TYPE(state, item) {
      state.productTypeSelected = state.productTypeSelected.id === item.id ? {} : item;
    },
    // 用户点击了行业分类，在mutation中判断增加tag还是去掉tag
    SELECT_INDUSTRY(state, item) {
      state.industrySelected = state.industrySelected.id === item.id ? {} : item;
    },
    // 用户点击了专业分类，在mutation中判断增加tag还是去掉tag
    SELECT_SPECIALITY(state, item) {
      state.specialitySelected = state.specialitySelected.id === item.id ? {} : item;
    },
    // 用户点击了品牌分类，在mutation中判断增加tag还是去掉tag
    SELECT_BRAND(state, item) {
      state.brandSelected = state.brandSelected.id === item.id ? {} : item;
    },
    // 用户点击了客户分类，在mutation中判断增加tag还是去掉tag
    SELECT_CONSUMER_TYPE(state, item) {
      state.consumerTypeSelected = state.consumerTypeSelected.id === item.id ? {} : item;
    },

    // 设置产品选项列表
    SET_PRODUCT_TYPE_LIST(state, status) {
      state.productType = status;
    },
    // 设置产品选项列表
    SET_INDUSTRY_LIST(state, status) {
      state.industry = status;
    },
    // 设置产品选项列表
    SET_SPECIALITY_LIST(state, status) {
      state.speciality = status;
    },
    // 设置产品选项列表
    SET_BRAND_LIST(state, status) {
      state.brand = status;
    },
    // 设置产品选项列表
    SET_CONSUMER_TYPE_LIST(state, status) {
      state.consumerType = status;
    },

    // 设置产品列表的数据
    SET_PRODUCTS(state, status) {
      state.products = status;
    },
    // 设置产品列表总数
    SET_TOTAL(state, status) {
      state.total = status;
    },
    // 设置产品详情的数
    SET_PRODUCT_DETAIL(state, status) {
      let data = {
        imgUrl: status.productData.imgUrl,
        ProductType: status.productData.ProductType.name,
        Accessories: status.productData.Accessories,
        Hyperlinks: status.productData.Hyperlinks,
        title: status.productData.title,
        intro: status.productData.intro,
        id: status.productData.id,
        productIndividuality: status.arr
      };
      state.productDetail = data;
    },
    // 产品Show页loading控制
    SET_PRODUCT_SHOW_LOADING(state, status) {
      state.productShowLoading = status;
    }
  },

  getters: {
    searchSelected: state => state.searchSelected,

    productType: state => state.productType,
    productTypeSelected: state => state.productTypeSelected,
    industry: state => state.industry,
    industrySelected: state => state.industrySelected,
    speciality: state => state.speciality,
    specialitySelected: state => state.specialitySelected,
    brand: state => state.brand,
    brandSelected: state => state.brandSelected,
    consumerType: state => state.consumerType,
    consumerTypeSelected: state => state.consumerTypeSelected,

    products: state => state.products,
    productDetail: state => state.productDetail,
    businessDetail: state => state.businessDetail,

    productShowLoading: state => state.productShowLoading,
    total: state => state.total
  }
};
