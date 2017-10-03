import CoreLayout from '@/layouts/Core'
import DashboardLayout from '@/layouts/Dashboard'

import Profile from '@/pages/account/Profile'
import ApiSettings from '@/pages/account/settings/ApiSettings'
import AvatarSettings from '@/pages/account/settings/AvatarSettings'
import ProfileSettings from '@/pages/account/settings/ProfileSettings'
import SecuritySettings from '@/pages/account/settings/SecuritySettings'
import Signin from '@/pages/account/Signin'
import Register from '@/pages/account/Register'
import ForgottenPassword from '@/pages/account/ForgottenPassword'
import ResetPassword from '@/pages/account/ResetPassword'
import Newsletter from '@/pages/account/Newsletter'
import Projects from '@/pages/account/Projects'

export default [
  {
    path: '/account',
    component: CoreLayout,
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
        path: 'newsletter',
        name: 'newsletter',
        component: Newsletter
      },
      {
        path: ':username',
        name: 'profile',
        component: Profile
      },
      {
        path: ':username/projects',
        name: 'account-projects',
        component: Projects
      },
      {
        path: 'register/confirmation',
        name: 'register-confirmation',
        beforeEnter (to, from, next) {
          pybossaApi.get('/account/register/confirmation', {
            params: to.query
          }).then(r => {
            next({ path: r.data.next })
          }).catch(err => {
            next({ name: String(err.response.status) })
          })
        }
      }
    ]
  },
  {
    path: '/account/:username/update',
    component: DashboardLayout,
    props: {
      dashboardNavItems: [
        {
          id: 'account-api-settings',
          label: 'API',
          link: {
            name: 'account-api-settings'
          }
        },
        {
          id: 'account-avatar-settings',
          label: 'Avatar',
          link: {
            name: 'account-avatar-settings'
          }
        },
        {
          id: 'account-profile-settings',
          label: 'Profile',
          link: {
            name: 'account-profile-settings'
          }
        },
        {
          id: 'account-security-settings',
          label: 'Security',
          link: {
            name: 'account-security-settings'
          }
        }
      ]
    },
    children: [
      {
        path: '/',
        name: 'account-settings',
        redirect: {
          name: 'account-profile-settings'
        }
      },
      {
        path: 'api',
        name: 'account-api-settings',
        component: ApiSettings
      },
      {
        path: 'avatar',
        name: 'account-avatar-settings',
        component: AvatarSettings
      },
      {
        path: 'profile',
        name: 'account-profile-settings',
        component: ProfileSettings
      },
      {
        path: 'security',
        name: 'account-security-settings',
        component: SecuritySettings
      }
    ]
  }
]
