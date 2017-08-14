import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import store from '@/store'
import manageSession from '@/utils/manageSession'

import siteRoutes from '@/router/routes/site'
import accountRoutes from '@/router/routes/account'
import errorRoutes from '@/router/routes/error'
import helpRoutes from '@/router/routes/help'
import projectRoutes from '@/router/routes/project'

Vue.use(VueRouter)
Vue.use(VueMeta)

const routes = [].concat(
  siteRoutes,
  accountRoutes,
  errorRoutes,
  helpRoutes,
  projectRoutes
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
