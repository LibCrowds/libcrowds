import Home from '@/pages/project/Home'
import About from '@/pages/project/About'
import Data from '@/pages/project/Data'
import Results from '@/pages/project/Results'
import Contribute from '@/pages/project/Contribute'
import Statistics from '@/pages/project/Statistics'
import Presenter from '@/pages/project/Presenter'

// Guard to check for site configuration
const projectConfigGuard = function (to, from, next) {
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
    beforeEnter: projectConfigGuard
  },
  {
    path: '/project/:projectname/about',
    name: 'about',
    component: About,
    beforeEnter: projectConfigGuard
  },
  {
    path: '/project/:projectname/data',
    name: 'data',
    component: Data,
    beforeEnter: projectConfigGuard
  },
  {
    path: '/project/:projectname/contribute',
    name: 'contribute',
    component: Contribute,
    beforeEnter: projectConfigGuard
  },
  {
    path: '/project/:projectname/statistics',
    name: 'statistics',
    component: Statistics,
    beforeEnter: projectConfigGuard
  },
  {
    path: '/project/:projectname/presenter/:shortname',
    name: 'presenter',
    component: Presenter,
    beforeEnter: projectConfigGuard
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
