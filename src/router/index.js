import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/pages/Landing'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    }
  ]
})
