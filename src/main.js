// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import routes from '@/routes'
import store from '@/store'
import { sync } from 'vuex-router-sync'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import Icon from 'vue-awesome/components/Icon'

Vue.use(VueRouter)

Vue.use(BootstrapVue)

Vue.component('icon', Icon)

Vue.config.productionTip = false

// Routing logic
const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  render: h => h(App)
})
