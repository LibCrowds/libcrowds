import Vue from 'vue'
import Router from 'vue-router'
import config from '@/config'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: require('@/pages/Landing')
    },
    {
      path: '/site/:sitename',
      name: 'site',
      component: require('@/pages/Landing'),
      beforeEnter: (to, from, next) => {
        if (!(to.params.sitename in config)) {
          next({ name: '404' })
        }
        next()
      },
      children: [
        {
          path: 'about',
          component: require('@/pages/home/About')
        }
      ]
    },
    {
      path: '*',
      name: '404',
      component: require('@/pages/Error')
    }
  ]
})
