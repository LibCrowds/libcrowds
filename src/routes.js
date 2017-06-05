import config from '@/config'

export default [
  {
    path: '/',
    component: require('@/pages/Landing')
  },
  {
    path: '/site/:sitename',
    component: require('@/components/layouts/FloatingContainer'),
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
        component: require('@/components/Tabs'),
        props: {
          tabs: [
            { title: 'Background', content: require('@/pages/pybossa/about/Background') },
            { title: 'Technology', content: require('@/pages/pybossa/about/Technology') },
            { title: 'Contact', content: require('@/pages/pybossa/about/Contact') }
          ]
        }
      },
      {
        path: 'help',
        name: 'help',
        component: require('@/components/Tabs'),
        props: {
          tabs: [
            { title: 'Terms of Service', content: require('@/pages/pybossa/help/TOS') },
            { title: 'Privacy Policy', content: require('@/pages/pybossa/help/Privacy') },
            { title: 'Cookies Policy', content: require('@/pages/pybossa/help/Cookies') }
          ]
        }
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
        component: require('@/pages/pybossa/home/Data')
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
