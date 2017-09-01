import siteConfig from '@/siteConfig'

import CollectionBaseLayout from '@/layouts/CollectionBase'
import FloatingTabsLayout from '@/layouts/FloatingTabs'

import CollectionHome from '@/pages/collection/Home'
import CollectionAbout from '@/pages/collection/About'
import CollectionData from '@/pages/collection/Data'
import CollectionContribute from '@/pages/collection/Contribute'
import CollectionPresenter from '@/pages/collection/Presenter'

const routes = [
  {
    path: '/collection/:collectionname',
    component: CollectionBaseLayout,
    beforeEnter: function (to, from, next) {
      if (to.params.collectionname in siteConfig.collections) {
        next()
      } else {
        next({ name: '404' })
      }
    },
    children: [
      {
        path: '/',
        name: 'collection-home',
        component: CollectionHome
      },
      {
        path: 'about',
        component: FloatingTabsLayout,
        children: [
          {
            path: '/',
            name: 'collection-about',
            component: CollectionAbout
          }
        ]
      },
      {
        path: 'data',
        component: FloatingTabsLayout,
        children: [
          {
            path: '/',
            name: 'collection-data',
            component: CollectionData
          }
        ]
      },
      {
        path: 'contribute',
        component: FloatingTabsLayout,
        children: [
          {
            path: '/',
            name: 'collection-contribute',
            component: CollectionContribute
          }
        ]
      },
      {
        path: 'project/:shortname/presenter',
        component: FloatingTabsLayout,
        children: [
          {
            path: '/',
            name: 'collection-presenter',
            component: CollectionPresenter
          }
        ]
      }
    ]
  }
]

// Conditional routes (TODO: Update)
// if (config.resultsComponent) {
//   routes.push({
//     path: '/collection/:collectionname/statistics',
//     name: 'results',
//     component: Collection
//   })
// }

export default routes
