import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import store from '@/store'
import manageSession from '@/utils/manageSession'

import coreRoutes from '@/router/routes/core'
import accountRoutes from '@/router/routes/account'
import errorRoutes from '@/router/routes/error'
import helpRoutes from '@/router/routes/help'
import collectionRoutes from '@/router/routes/collection'

Vue.use(VueRouter)
Vue.use(VueMeta)

const routes = [].concat(
  coreRoutes,
  accountRoutes,
  errorRoutes,
  helpRoutes,
  collectionRoutes
)

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  manageSession(store, document.cookie)
  next()
})

export default router
