import Presenter from '@/pages/projects/Presenter'

export default [
  {
    path: '/projects/:shortname',
    component: {
      render (c) {
        return c('router-view')
      }
    },
    children: [
      {
        path: 'presenter',
        name: 'presenter',
        component: Presenter
      }
    ]
  }
]
