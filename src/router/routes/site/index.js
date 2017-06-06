import config from '@/config'
import store from '@/store'

import home from '@/router/routes/site/home'
import about from '@/router/routes/site/about'
import help from '@/router/routes/site/help'
import data from '@/router/routes/site/data'

export default {
  path: '/site/:shortname',
  component: require('@/components/layouts/FloatingContainer'),

  beforeEnter: (to, from, next) => {
    let siteConfig = config.sites.find(function (site) {
      return site.shortname === to.params.shortname
    })

    if (typeof siteConfig === 'undefined') {
      next({ name: '404' })
    }

    store.commit('SET_PYBOSSA_SITE', siteConfig)
    next()
  },

  children: [
    home,
    about,
    help,
    data
  ]
}
