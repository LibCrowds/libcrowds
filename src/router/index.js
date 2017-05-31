import Vue from 'vue'
import Router from 'vue-router'
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
      path: '/site/:name',
      name: 'site',
      component: require('@/pages/Landing'),
      beforeEnter: (to, from, next) => {
        console.log(to.params.name in config)
        if (!(to.params.name in config)) {
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

export default router
