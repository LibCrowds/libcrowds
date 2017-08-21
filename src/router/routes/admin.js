import DashboardLayout from '@/pages/layouts/Dashboard'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import Administrators from '@/pages/admin/Administrators'
import Announcements from '@/pages/admin/Announcements'
import Categories from '@/pages/admin/Categories'
import Featured from '@/pages/admin/Featured'

export default [
  {
    path: '/admin',
    component: DashboardLayout,
    props: {
      dashboard: 'admin'
    },
    children: [
      {
        path: '/',
        name: 'admin-dashboard',
        component: AdminDashboard
      },
      {
        path: 'administrators',
        name: 'admin-administrators',
        component: Administrators
      },
      {
        path: 'announcement',
        name: 'admin-announcements',
        component: Announcements
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: Categories
      },
      {
        path: 'featured',
        name: 'admin-featured',
        component: Featured
      }
    ]
  }
]
