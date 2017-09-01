import CoreLayout from '@/layouts/Core'

import Help from '@/pages/help/Help'

export default [
  {
    path: '/help',
    component: CoreLayout,
    children: [
      {
        path: '/',
        name: 'help',
        component: Help
      }
    ]
  }
]
