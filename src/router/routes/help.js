import AppBase from '@/pages/AppBase'
import TOS from '@/pages/help/TOS'
import Privacy from '@/pages/help/Privacy'
import Cookies from '@/pages/help/Cookies'
import Api from '@/pages/help/Api'

export default [
  {
    path: '/help',
    component: AppBase,
    beforeEnter: function (to, from, next) {
      if (to.fullPath === '/help') {
        next({ name: '404' })
      }
      next()
    },
    children: [
      {
        path: 'tos',
        name: 'tos',
        component: TOS
      },
      {
        path: 'privacy',
        name: 'privacy',
        component: Privacy
      },
      {
        path: 'cookies',
        name: 'cookies',
        component: Cookies
      },
      {
        path: 'api',
        name: 'api',
        component: Api
      }
    ]
  }
]
