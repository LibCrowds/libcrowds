import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/pages/Landing'
import Error from '@/pages/Error'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/site/playbills',
      name: 'playbills',
      component: Landing,
      props: {
        pybossaApi: process.env.NODE_ENV === 'production'
                      ? 'http://'
                      : 'http://localhost:5000'
      }
    }
  ]
})
