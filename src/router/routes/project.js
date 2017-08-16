import Base from '@/pages/project/Base'
import Home from '@/pages/project/Home'
import About from '@/pages/project/About'
import Data from '@/pages/project/Data'
// import Results from '@/pages/project/Results'
import Contribute from '@/pages/project/Contribute'
import Statistics from '@/pages/project/Statistics'
import Presenter from '@/pages/project/Presenter'

const routes = [
  {
    path: '/project/:projectname',
    component: Base,
    beforeEnter: function (to, from, next) {
      try {
        require(`../../settings/projects/${to.params.projectname}/config.js`)
      } catch (err) {
        next({ name: '404' })
      }
      next()
    },
    children: [
      {
        path: '/',
        name: 'project-home',
        component: Home
      },
      {
        path: 'about',
        name: 'about',
        component: About
      },
      {
        path: 'data',
        name: 'data',
        component: Data
      },
      {
        path: 'contribute',
        name: 'contribute',
        component: Contribute
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: Statistics
      },
      {
        path: 'presenter/:shortname',
        name: 'presenter',
        component: Presenter
      }
    ]
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
