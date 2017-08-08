import Profile from '@/pages/account/Profile'
import Settings from '@/pages/account/Settings'
import Signin from '@/pages/account/Signin'
import Register from '@/pages/account/Register'
import ForgottenPassword from '@/pages/account/ForgottenPassword'

export default [
  {
    path: '/account/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/account/register',
    name: 'register',
    component: Register
  },
  {
    path: '/account/forgot-password',
    name: 'forgot-password',
    component: ForgottenPassword
  },
  {
    path: '/account/:username',
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
        name: 'account-update',
        component: Settings
      }
    ]
  }
]
