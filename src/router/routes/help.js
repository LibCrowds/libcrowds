import DashboardLayout from '@/layouts/Dashboard'

import API from '@/pages/help/API'
import Cookies from '@/pages/help/Cookies'
import Privacy from '@/pages/help/Privacy'
import TOS from '@/pages/help/TOS'

export default [
  {
    path: '/help',
    component: DashboardLayout,
    props: {
      dashboardNavItems: [
        {
          id: 'help-api',
          label: 'API',
          link: {
            name: 'help-api'
          }
        },
        {
          id: 'help-cookies',
          label: 'Cookies Policy',
          link: {
            name: 'help-cookies'
          }
        },
        {
          id: 'help-privacy',
          label: 'Privacy Policy',
          link: {
            name: 'help-privacy'
          }
        },
        {
          id: 'help-tos',
          label: 'Terms of Service',
          link: {
            name: 'help-tos'
          }
        }
      ]
    },
    children: [
      {
        path: '/api',
        name: 'help-api',
        component: API
      },
      {
        path: '/cookies',
        name: 'help-cookies',
        component: Cookies
      },
      {
        path: '/privacy',
        name: 'help-privacy',
        component: Privacy
      },
      {
        path: '/tos',
        name: 'help-tos',
        component: TOS
      }
    ]
  }
]
