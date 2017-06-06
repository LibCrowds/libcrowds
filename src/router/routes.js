import config from '@/config'
import store from '@/store'

export default [
  {
    path: '/',
    component: require('@/pages/Landing')
  },
  {
    path: '/site/:shortname',
    component: require('@/components/layouts/FloatingContainer'),
    beforeEnter: (to, from, next) => {
      let siteConfig = config.sites.find(function (site) {
        return site.shortname === to.params.shortname
      })

      if (typeof siteConfig === 'undefined') {
        next({ name: '404' })
      }

      store.commit('SET_SITE_CONFIG', siteConfig)
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
        path: 'data',
        name: 'data',
        component: require('@/components/Tabs'),
        props: {
          tabs: [
            { title: 'Datasets', content: require('@/pages/pybossa/data/Datasets') },
            { title: 'Tasks', content: require('@/pages/pybossa/data/Tasks') },
            { title: 'Task Runs', content: require('@/pages/pybossa/data/TaskRuns') }
          ]
        }
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
