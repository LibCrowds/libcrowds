import Vue from 'vue'
import VueRouter from 'vue-router'

import landing from '@/router/routes/landing'
import site from '@/router/routes/site'
import notFound from '@/router/routes/notFound'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    landing,
    site,
    notFound
  ]
})

export default router
