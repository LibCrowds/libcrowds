import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/pages/Landing'
import Error from '@/pages/Error'

Vue.use(Router)

const router = new Router({
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
    },
    {
      path: '*',
      name: '404',
      component: Error,
      meta: {
        title: 'Page not found',
        description: 'We can\'t find the page that you\'re looking for.'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
