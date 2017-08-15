import Presenter from '@/pages/taskset/Presenter'

export default [
  {
    path: '/taskset/:shortname',
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
