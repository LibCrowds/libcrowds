import TOS from '@/pages/help/TOS'
import Privacy from '@/pages/help/Privacy'
import Cookies from '@/pages/help/Cookies'
import Api from '@/pages/help/Api'

export default [
  {
    path: '/help/tos',
    name: 'tos',
    component: TOS
  },
  {
    path: '/help/privacy',
    name: 'privacy',
    component: Privacy
  },
  {
    path: '/help/cookies',
    name: 'cookies',
    component: Cookies
  },
  {
    path: '/help/api',
    name: 'api',
    component: Api
  }
]
