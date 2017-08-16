import Home from '@/pages/project/Home'
import About from '@/pages/project/About'
import Data from '@/pages/project/Data'
import Results from '@/pages/project/Results'
import Contribute from '@/pages/project/Contribute'
import Statistics from '@/pages/project/Statistics'

// Guard to check for site configuration
const siteGuard = function (to, from, next) {
  try {
    require(`@/settings/projects/${to.params.projectname}/config`)
  } catch (err) {
    next(false)
  }
  next()
}

const routes = [
  {
    path: '/project/:projectname',
    name: 'landing',
    component: Home,
    beforeEnter: siteGuard
  },
  {
    path: '/project/:projectname/about',
    name: 'about',
    component: About,
    beforeEnter: siteGuard
  },
  {
    path: '/project/:projectname/data',
    name: 'data',
    component: Data,
    beforeEnter: siteGuard
  },
  {
    path: '/project/:projectname/contribute',
    name: 'contribute',
    component: Contribute,
    beforeEnter: siteGuard
  },
  {
    path: '/project/:projectname/statistics',
    name: 'statistics',
    component: Statistics,
    beforeEnter: siteGuard
  }
]

// Conditional routes (TODO: Update)
// if (config.resultsComponent) {
//   routes.push({
//     path: '/project/:projectname/statistics',
//     name: 'results',
//     component: Results
//   })
// }

export default routes
