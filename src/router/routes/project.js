import ProjectBase from '@/pages/project/Base'
import ProjectHome from '@/pages/project/Home'
import ProjectAbout from '@/pages/project/About'
import ProjectData from '@/pages/project/Data'
// import Results from '@/pages/project/Results'
import ProjectContribute from '@/pages/project/Contribute'
import ProjectPresenter from '@/pages/project/Presenter'

const routes = [
  {
    path: '/project/:projectname',
    component: ProjectBase,
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
        component: ProjectHome
      },
      {
        path: 'about',
        name: 'project-about',
        component: ProjectAbout
      },
      {
        path: 'data',
        name: 'project-data',
        component: ProjectData
      },
      {
        path: 'contribute',
        name: 'project-contribute',
        component: ProjectContribute
      },
      {
        path: 'presenter/:shortname',
        name: 'presenter',
        component: ProjectPresenter
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
