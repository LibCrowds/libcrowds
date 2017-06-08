import config from '@/config'
import store from '@/store'

import Landing from '@/pages/Landing'

import About from '@/pages/pybossa/home/About'
import Data from '@/pages/pybossa/home/Data'

import TOS from '@/pages/pybossa/help/TOS'
import Privacy from '@/pages/pybossa/help/Privacy'
import Cookies from '@/pages/pybossa/help/Cookies'

export default {
  path: '/site/:shortname',
  component: {
    render (c) { return c('router-view') }
  },

  // Check if the site is configured
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
    { path: 'data', name: 'data', component: Data },

    { path: 'tos', name: 'tos', component: TOS },
    { path: 'privacy', name: 'privacy', component: Privacy },
    { path: 'cookies', name: 'cookies', component: Cookies }
  ]
}
