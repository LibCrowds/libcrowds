import AppBase from '@/pages/core/Base'
import Landing from '@/pages/core/Landing'
import Statistics from '@/pages/core/Statistics'

export default [
  {
    path: '/',
    component: AppBase,
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
