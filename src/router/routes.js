import config from '@/config'

import Landing from '@/pages/Landing'

import About from '@/pages/home/About'
import Data from '@/pages/home/Data'
import Results from '@/pages/home/Results'
import Contribute from '@/pages/home/Contribute'
import Statistics from '@/pages/home/Statistics'

import TOS from '@/pages/help/TOS'
import Privacy from '@/pages/help/Privacy'
import Cookies from '@/pages/help/Cookies'
import Api from '@/pages/help/Api'

import Presenter from '@/pages/projects/Presenter'

import Profile from '@/pages/users/Profile'

const routes = [
  { path: '/', name: 'landing', component: Landing },
  { path: '/about', name: 'about', component: About },
  { path: '/data', name: 'data', component: Data },
  { path: '/contribute', name: 'contribute', component: Contribute },
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
      {
        path: 'presenter',
        name: 'presenter',
        component: Presenter,
        props: (route) => ({
          shortname: route.params.shortname
        })
      }
    ]
  },

  {
    path: '/users/:username',
    component: {
      render (c) {
        return c('router-view')
      }
    },
    // TODO: Add navigation guard for non-existant users
    children: [
      {
        path: '/',
        name: 'profile',
        component: Profile,
        props: (route) => ({
          username: route.params.username
        })
      }
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

if (config.resultsComponent) {
  routes.push({ path: '/results', name: 'results', component: Results })
}

export default routes
