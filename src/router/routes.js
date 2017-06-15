import config from '@/config'
import store from '@/store'

import Landing from '@/pages/Landing'

import Home from '@/pages/home/Home'
import About from '@/pages/home/About'
import Data from '@/pages/home/Data'
import Results from '@/pages/home/Results'
import Projects from '@/pages/home/Projects'
import TOS from '@/pages/help/TOS'
import Privacy from '@/pages/help/Privacy'
import Cookies from '@/pages/help/Cookies'
import Api from '@/pages/help/Api'
import Signin from '@/pages/account/Signin'
import Register from '@/pages/account/Register'

export default [

  // Core site
  { path: '/', name: 'core', component: Landing },
  { path: '/help/tos', name: 'tos', component: TOS },
  { path: '/help/privacy', name: 'privacy', component: Privacy },
  { path: '/help/cookies', name: 'cookies', component: Cookies },
  { path: '/help/api', name: 'api', component: Api },
  { path: '/account/signin', name: 'signin', component: Signin },
  { path: '/account/register', name: 'register', component: Register },

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

      store.commit('SET_ITEM', { key: 'siteConfig', value: siteConfig })
      next()
    },
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'about', name: 'about', component: About },
      { path: 'data', name: 'data', component: Data },
      { path: 'projects', name: 'projects', component: Projects },
      { path: 'results', name: 'results', component: Results }
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
