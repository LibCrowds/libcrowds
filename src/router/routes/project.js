import DashboardLayout from '@/layouts/Dashboard'

import ProjectSettings from '@/pages/project/ProjectSettings'
import ProjectThumbnail from '@/pages/project/ProjectThumbnail'

export default [
  {
    path: '/project/:shortname',
    component: DashboardLayout,
    props: {
      dashboardNavItems: [
        {
          id: 'project-settings',
          label: 'Settings',
          link: {
            name: 'project-settings'
          }
        },
        {
          id: 'project-thumbnail',
          label: 'Thumbnail',
          link: {
            name: 'project-thumbnail'
          }
        }
      ]
    },
    children: [
      {
        path: '/',
        name: 'project-settings',
        component: ProjectSettings
      },
      {
        path: 'thumbnail',
        name: 'project-thumbnail',
        component: ProjectThumbnail
      }
    ]
  }
]
