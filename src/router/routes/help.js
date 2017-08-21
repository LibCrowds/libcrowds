import AppBase from '@/pages/AppBase'
import Help from '@/pages/help/Help'

export default [
  {
    path: '/help',
    component: AppBase,
    children: [
      {
        path: '/',
        name: 'help',
        component: Help
      }
    ]
  }
]
