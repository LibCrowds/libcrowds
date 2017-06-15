// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import router from '@/router'
import { sync } from 'vuex-router-sync'
import BootstrapVue from 'bootstrap-vue'
import VueProgressBar from 'vue-progressbar'
import Icon from 'vue-awesome/components/Icon'

Vue.use(BootstrapVue)

Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '2px'
})

Vue.component('icon', Icon)

Vue.config.productionTip = false

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  render: h => h(App)
})
