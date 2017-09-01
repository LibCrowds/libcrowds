import Core from '@/layouts/Core'

import Landing from '@/pages/core/Landing'
import Statistics from '@/pages/core/Statistics'

export default [
  {
    path: '/',
    component: Core,
    children: [
      {
        path: '/',
        name: 'landing',
        component: Landing
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: Statistics
      }
    ]
  }
]
