import config from '@/config'

export default [
  {
    path: '/',
    component: require('@/pages/Landing')
  },
  {
    path: '/site/:sitename',
    component: require('@/components/layouts/Main'),
    beforeEnter: (to, from, next) => {
      if (!(to.params.sitename in config.pybossaSites)) {
        next({ name: '404' })
      }
      next()
    },
    children: [
      {
        path: '',
        name: 'home',
        component: require('@/pages/Landing')
      },
      {
        path: 'about',
        name: 'about',
        component: require('@/pages/pybossa/home/About')
      },
      {
        path: 'projects',
        name: 'projects',
        component: require('@/pages/pybossa/projects/Projects')
      },
      {
        path: 'stats',
        name: 'stats',
        component: require('@/pages/pybossa/home/Stats')
      },
      {
        path: 'results',
        name: 'results',
        component: require('@/pages/pybossa/home/Results')
      },
      {
        path: 'data',
        name: 'data',
        component: require('@/pages/pybossa/home/About')
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    alias: '*',
    component: require('@/pages/Error'),
    meta: { title: 'Page Not Found' }
  }
]
