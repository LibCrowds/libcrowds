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
import adminRoutes from '@/router/routes/admin'
import projectRoutes from '@/router/routes/project'

Vue.use(VueRouter)
Vue.use(VueMeta)

const routes = [].concat(
  coreRoutes,
  accountRoutes,
  errorRoutes,
  helpRoutes,
  collectionRoutes,
  adminRoutes,
  projectRoutes
)

const router = new VueRouter({
  mode: 'history',
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  manageSession(store, document.cookie)
  next()
})

export default router
