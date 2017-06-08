import config from '@/config'
import store from '@/store'

import Core from '@/components/layouts/Core'
import Landing from '@/pages/Landing'

import About from '@/pages/pybossa/home/About'
import Data from '@/pages/pybossa/home/Data'
import TOS from '@/pages/pybossa/help/TOS'
import Privacy from '@/pages/pybossa/help/Privacy'
import Cookies from '@/pages/pybossa/help/Cookies'
import Api from '@/pages/pybossa/help/Api'

export default [

  // Core site
  { path: '/', name: 'core', component: Core },
  { path: 'tos', name: 'tos', component: TOS },
  { path: 'privacy', name: 'privacy', component: Privacy },
  { path: 'cookies', name: 'cookies', component: Cookies },
  { path: 'api', name: 'api', component: Api },

  // PYBOSSA meta-category sites
  {
    path: '/site/:shortname',
    component: {
      render (c) {
        return c('router-view')
      }
    },
    beforeEnter: (to, from, next) => {
      let siteConfig = config.sites.find(function (site) {
        return site.shortname === to.params.shortname
      })

      if (typeof siteConfig === 'undefined') {
        next({ name: '404' })
      }

      store.commit('SET_SITE_CONFIG', siteConfig)
      next()
    },
    children: [
      { path: '', name: 'home', component: Landing },
      { path: 'about', name: 'about', component: About },
      { path: 'data', name: 'data', component: Data }
    ]
  },

  // Errors
  {
    path: '/404',
    name: '404',
    alias: '*',
    component: require('@/pages/Error'),
    props: {
      title: 'Page Not Found',
      description: 'We could not find the page you were looking for'
    }
  }
]
