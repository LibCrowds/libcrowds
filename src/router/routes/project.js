import DashboardLayout from '@/layouts/Dashboard'

import ProjectSettings from '@/pages/project/ProjectSettings'

export default [
  {
    path: '/project/:shortname',
    component: DashboardLayout,
    props: {
      dashboardNavItems: [
        {
          id: 'settings',
          label: 'Settings',
          link: {
            name: 'project-settings'
          }
        }
      ]
    },
    children: [
      {
        path: '/',
        name: 'project-settings',
        component: ProjectSettings
      }
    ]
  }
]
