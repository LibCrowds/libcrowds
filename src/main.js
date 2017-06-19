// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@/icons'
import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import router from '@/router'
import { sync } from 'vuex-router-sync'
import BootstrapVue from 'bootstrap-vue'
import VueGravatar from 'vue-gravatar'

Vue.use(BootstrapVue)

Vue.component('v-gravatar', VueGravatar)

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
