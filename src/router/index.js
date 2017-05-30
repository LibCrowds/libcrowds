import Vue from 'vue'
import Router from 'vue-router'
import tld from 'tldjs'
import store from '@/store'
import config from '@/config'

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

// Check for project configuration
router.beforeEach((to, from, next) => {
  const subdomain = tld.getSubdomain(window.location.host)
  const siteConfig = process.env.NODE_ENV === 'development'
                       ? config.sites.dev
                       : config.sites[subdomain]

  if (typeof siteConfig === 'undefined') {
    next(false)
  }

  store.commit('SET_ITEM', {
    key: 'siteConfig',
    val: siteConfig
  })

  next()
})

export default router
