import CollectionBase from '@/pages/collection/Base'
import CollectionHome from '@/pages/collection/Home'
import CollectionAbout from '@/pages/collection/About'
import CollectionData from '@/pages/collection/Data'
// import CollectionResults from '@/pages/collection/Results'
import CollectionContribute from '@/pages/collection/Contribute'
import CollectionPresenter from '@/pages/collection/Presenter'

const routes = [
  {
    path: '/collection/:collectionname',
    component: CollectionBase,
    beforeEnter: function (to, from, next) {
      try {
        require(`../../settings/collections/${collectionname}/config.js`)
      } catch (err) {
        next({ name: '404' })
      }
      next()
    },
    children: [
      {
        path: '/',
        name: 'collection-home',
        component: CollectionHome
      },
      {
        path: 'about',
        name: 'collection-about',
        component: CollectionAbout
      },
      {
        path: 'data',
        name: 'collection-data',
        component: CollectionData
      },
      {
        path: 'contribute',
        name: 'collection-contribute',
        component: CollectionContribute
      },
      {
        path: '/project/:shortname/presenter',
        name: 'presenter',
        component: CollectionPresenter
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
