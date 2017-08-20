import AppBase from '@/pages/AppBase'
import Profile from '@/pages/account/Profile'
import Settings from '@/pages/account/Settings'
import Signin from '@/pages/account/Signin'
import Register from '@/pages/account/Register'
import ForgottenPassword from '@/pages/account/ForgottenPassword'
import ResetPassword from '@/pages/account/ResetPassword'

export default [
  {
    path: '/account',
    component: AppBase,
    beforeEnter: function (to, from, next) {
      if (to.fullPath === '/account') {
        next({ name: '404' })
      }
      next()
    },
    children: [
      {
        path: 'signin',
        name: 'signin',
        component: Signin
      },
      {
        path: 'register',
        name: 'register',
        component: Register
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgottenPassword
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPassword
      },
      {
        path: ':username',
        component: {
          render (c) {
            return c('router-view')
          }
        },
        children: [
          {
            path: '/',
            name: 'profile',
            component: Profile
          },
          {
            path: 'update',
            name: 'account-settings',
            component: Settings
          }
        ]
      }
    ]
  }
]
