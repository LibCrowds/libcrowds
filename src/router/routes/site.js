import config from '@/config'
import Landing from '@/pages/Landing'
import About from '@/pages/site/About'
import Data from '@/pages/site/Data'
import Results from '@/pages/site/Results'
import Contribute from '@/pages/site/Contribute'
import Statistics from '@/pages/site/Statistics'

// Guard to check for site configuration
const siteGuard = function (to, from, next) {
  try {
    require(`@/custom/${to.params.sitename}/config`)
  } catch (err) {
    next(false)
  }
  next()
}

const routes = [
  {
    path: '/site/:sitename',
    name: 'landing',
    component: Landing,
    beforeEnter: siteGuard
  },
  {
    path: '/site/:sitename/about',
    name: 'about',
    component: About,
    beforeEnter: siteGuard
  },
  {
    path: '/site/:sitename/data',
    name: 'data',
    component: Data,
    beforeEnter: siteGuard
  },
  {
    path: '/site/:sitename/contribute',
    name: 'contribute',
    component: Contribute,
    beforeEnter: siteGuard
  },
  {
    path: '/site/:sitename/statistics',
    name: 'statistics',
    component: Statistics,
    beforeEnter: siteGuard
  }
]

// Conditional routes
if (config.resultsComponent) {
  routes.push({
    path: '/results',
    name: 'results',
    component: Results
  })
}

export default routes
