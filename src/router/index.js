import Vue from 'vue'
import Router from 'vue-router'
import config from '@/config'
import getSiteKey from '@/utils/get-site-key'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: require('@/pages/Landing')
    },
    {
      path: '/about',
      name: 'about',
      component: require('@/pages/home/About')
    },
    {
      path: '*',
      name: '404',
      component: require('@/pages/Error')
    }
  ]
})

// Check for site config
router.beforeEach((to, from, next) => {
  const key = getSiteKey()

  if (key in config) {
    next()
  }

  next(false)
})

export default router
