import UserApi from '../api/ProductBase/ProductCategory'


export default {
  namespaced: true,
  state: {
    // 产品分类
    productCategory: [],
    // 存放选择了的产品分类
    productSelected: {},
    // 行业分类
    industryCategory: [],
    // 存放选择了的行业分类
    industrySelected: {},
    // 选择了产品之后要展示的子级分类
    moreSelection: [],
    // 用户选择了的子级分类
    moreSelectionSelected: {},
    // 用户搜索的tag
    searchSelected: '',
    // 产品信息列表
    products: [],
    // productShow 产品信息列表展示区域的loading
    productShowLoading: false,
    // 要查看的产品的详细信息
    productDetail: {},
    // 一个xx设计院下边的详细信息
    businessDetail: {},
    // 控制自选项的loading
    moreLoading: false,
    // 总条数
    total: 0,
  },
  mutations: {
    // 用户点击搜索，添加搜索tag
    SELECT_SEARCH(state, item) {
      state.searchSelected = item
      // 其它选择了的全清掉
      state.productSelected = {}
      state.industrySelected = {}
      state.moreSelectionSelected = {}
      state.moreSelection = []
    },
    // 用户点击了产品的分类，在mutation中判断增加tag还是去掉tag
    SELECT_PRODUCT(state, item){
      state.productSelected = state.productSelected.Keyword === item.Keyword ? {} : item
    },
    // 用户点击了行业的分类，在mutation中判断增加tag还是去掉tag
    SELECT_INDUSTRY(state, item){
      if ( state.industrySelected.Keyword === item.Keyword ){
        // 重置行业已选择
        state.industrySelected = {}
        // 重置行业子选项
        state.moreSelection = []
      } else {
        state.industrySelected = item
      }
      // 重置行业自选项已选择
      state.moreSelectionSelected = {}
    },
    // 用户点击了行业分类的子分类，在mutation中判断增加tag还是去掉tag
    SELECT_INDUSTRY_MORE_SELECTION(state, item) {
      // 如果该子分类已经在
      if (state.moreSelectionSelected.Keyword === item.Keyword){
        state.moreSelectionSelected = {}
      } else {
        state.moreSelectionSelected = item
      }
    },
    // 设置行业分类的子选项
    SET_INDUSTRY_MORE_SELECTION(state, status) {
      state.moreSelection = status
    },
    // 设置产品选项列表
    SET_PRODUCT_CATEGORY_LIST(state, status){
      state.productCategory = status
    },
    // 设置行业选项列表
    SET_INDUSTRY_CATEGORY_LIST(state, status){
      state.industryCategory = status
    },
    // 设置产品列表的数据
    SET_PRODUCTS(state, status) {
      state.products = status
    },
    // 设置产品列表总数
    SET_TOTAL(state, status) {
      state.total = status
    },
    // 设置产品详情的数
    SET_PRODUCT_DETAIL(state, status) {
      // 给status排序先
      // 先排序父行业
      let keywordMap = status.Individuation.map(i => i.Code)
      let cursor = keywordMap.indexOf(state.industrySelected.Code)
      if(cursor !== -1) {
        if(cursor != 0) {
          let item = status.Individuation.splice(cursor, 1)
          status.Individuation.unshift(item[0])
          // 子级行业排序
          keywordMap = status.Individuation[0].Sub.map(i => i.Code)
          cursor = keywordMap.indexOf(state.moreSelectionSelected.Code)
          if(cursor !== -1) {
            if(cursor != 0) {
              item = status.Individuation[0].Sub.splice(cursor, 1)
              status.Individuation[0].Sub.unshift(item[0])
            }
          }
        }
      }
      state.productDetail = status
    },
    // 产品Show页loading控制
    SET_PRODUCT_SHOW_LOADING(state, status){
      state.productShowLoading = status
    },
    // 控制行业自选项的loading
    SET_MORE_SELECTION_LOADING(state, status) {
      state.moreLoading = status
    }
  },
  actions: {
    // 用户点击搜查，添加搜查的tag
    searchSelect({ commit }, item){
      // 虽然叫item，其实只是一个字符串
      commit('SELECT_SEARCH', item)
    },
    // 获取产品分类的列表
    getProductCategoryList({ commit }){
      return new Promise((resolve, reject) => {
        UserApi.getProductCategoryList().then(res => {
          commit('SET_PRODUCT_CATEGORY_LIST', res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取行业分类的列表
    getIndustryCategoryList({ commit }){
      return new Promise((resolve, reject) => {
        UserApi.getIndustryCategoryList().then(res => {
          commit('SET_INDUSTRY_CATEGORY_LIST', res.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取行业子分类的列表
    getChildrenIndustryCategoryList({ commit, state }, Keyword) {
      commit('SET_MORE_SELECTION_LOADING', true)
      return new Promise((resolve, reject) => {
        UserApi.getIndustryCategoryList(Keyword).then(res => {
          if(state.industrySelected.Keyword === Keyword) {
            commit("SET_INDUSTRY_MORE_SELECTION", res.data)
          }
          commit('SET_MORE_SELECTION_LOADING', false)
          resolve()
        }).catch(err => {
          commit('SET_MORE_SELECTION_LOADING', false)
          reject(err)
        })
      })
    },
    // 用户点击产品分类时
    productSelect({ commit }, item){
      // 保留
      commit('SELECT_PRODUCT', item)
    },
    // 用户点击行业分类时
    industrySelect({ commit, state, dispatch }, item) {
      // 清空原来的子选项
      commit('SET_INDUSTRY_MORE_SELECTION', [])
      // 关掉loading
      commit('SET_MORE_SELECTION_LOADING', false)
      if(state.industrySelected.Keyword !== item.Keyword){
        // 需要去查询有没有子分类
        if(item.leaf === 'false') {
          dispatch('getChildrenIndustryCategoryList', item.Keyword)
        }
      }
      commit('SELECT_INDUSTRY', item)
    },
    // 用户点击了行业分类的子分类
    industryMoreSelectionSelect({ commit }, item){
      // 保留需不需要发请求
      commit('SELECT_INDUSTRY_MORE_SELECTION', item)
    },
    // 用户获取产品列表
    getProductList({ commit }, payload){
      commit('SET_PRODUCT_SHOW_LOADING', true)
      return new Promise((resolve, reject) => {
        UserApi.getProductList(
          payload.filter,
          payload.productLabelList,
          payload.industryLabelList,
          payload.limit,
          payload.page
        ).then(res => {
          if(res.success) {
            commit("SET_TOTAL", res.total)
            commit('SET_PRODUCTS', res.data)
            commit("SET_PRODUCT_SHOW_LOADING", false)
            resolve()
          } else {
            commit("SET_PRODUCT_SHOW_LOADING", false)
            reject()
          }
        }).catch((err) => {
          commit("SET_PRODUCT_SHOW_LOADING", false)
          reject(err)
        })
      })
    },
    // 获取产品信息和行业个性化（目录）
    getProduct({ commit }, productKeyword) {
      commit('SET_PRODUCT_SHOW_LOADING', true)
      return new Promise((resolve, reject) => {
        UserApi.getProduct(productKeyword).then(res => {
          if(res.success) {
            commit('SET_PRODUCT_DETAIL', res.data[0])
            commit("SET_PRODUCT_SHOW_LOADING", false)
            resolve()
          } else {
            commit("SET_PRODUCT_SHOW_LOADING", false)
            reject(res)
          }

        }).catch((err) => {
          commit("SET_PRODUCT_SHOW_LOADING", false)
          reject(err)
        })
      })
    }
  },
  getters: {
    productCategory: state => state.productCategory,
    industryCategory: state => state.industryCategory,
    products: state => state.products,
    productDetail: state => state.productDetail,
    businessDetail: state => state.businessDetail,
    moreSelection: state => state.moreSelection,
    industrySelected: state => state.industrySelected,
    productSelected: state => state.productSelected,
    moreSelectionSelected: state => state.moreSelectionSelected,
    searchSelected: state => state.searchSelected,
    productShowLoading: state => state.productShowLoading,
    moreLoading: state => state.moreLoading,
    total: state => state.total,
  }
}
