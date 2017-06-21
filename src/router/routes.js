import Landing from '@/pages/Landing'

import About from '@/pages/home/About'
import Data from '@/pages/home/Data'
import Results from '@/pages/home/Results'
import Projects from '@/pages/home/Projects'
import Statistics from '@/pages/home/Statistics'

import TOS from '@/pages/help/TOS'
import Privacy from '@/pages/help/Privacy'
import Cookies from '@/pages/help/Cookies'
import Api from '@/pages/help/Api'

import Presenter from '@/pages/projects/Presenter'

export default [

  // Core site
  { path: '/', name: 'landing', component: Landing },
  { path: '/about', name: 'about', component: About },
  { path: '/data', name: 'data', component: Data },
  { path: '/projects', name: 'projects', component: Projects },
  { path: '/results', name: 'results', component: Results },
  { path: '/statistics', name: 'statistics', component: Statistics },

  { path: '/help/tos', name: 'tos', component: TOS },
  { path: '/help/privacy', name: 'privacy', component: Privacy },
  { path: '/help/cookies', name: 'cookies', component: Cookies },
  { path: '/help/api', name: 'api', component: Api },

  {
    path: '/projects/:shortname',
    component: {
      render (c) {
        return c('router-view')
      }
    },
    // TODO: Add navigation guard for non-existant projects
    children: [
      { path: 'presenter', name: 'presenter', component: Presenter }
    ]
  },

  // Errors
  {
    path: '/404',
    name: '404',
    alias: '*',
    component: require('@/pages/Error'),
    props: {
      title: 'Page Not Found',
      description: 'We could not find the page you were looking for'
    }
  }
]
