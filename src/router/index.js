import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

import routes from '@/router/routes'

Vue.use(VueRouter)
Vue.use(VueMeta)

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

router.beforeEach(function (to, from, next) {
  window.scrollTo(0, 0)
  next()
})

export default router
