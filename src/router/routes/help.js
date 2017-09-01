import Core from '@/layouts/Core'

import Help from '@/pages/help/Help'

export default [
  {
    path: '/help',
    component: Core,
    children: [
      {
        path: '/',
        name: 'help',
        component: Help
      }
    ]
  }
]
