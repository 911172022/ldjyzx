import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 使用element组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//注册组件
import './components'
import Router from 'vue-router'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import echarts from 'echarts'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.config.productionTip = false

// // 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  inserted: el => el.querySelector('input').focus()
})

// 完整引入 Element 组件库
Vue.use(ElementUI)
// 图片预览组件
Vue.use(Viewer)
Viewer.setDefaults({
  zIndexInline: 1000
})
Vue.prototype.$echarts = echarts

let vue = new Vue({
  router,
  store,
  render: h => h(App),
})

vue.$mount('#app')
window.$vue = vue
