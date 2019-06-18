// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import sockjs from 'sockjs-client';
import stompjs from 'stompjs';
//使用swiper插件
import VueAwesomeSwiper  from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css'
// import Print from 'vue-print-nb'
// 　　Vue.use(Print); //注册
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)
Vue.use(VueAwesomeSwiper);

Vue.config.productionTip = false
Vue.use(element);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
