import DashboardLayout from '@/pages/layouts/Dashboard'
import AdminDashboard from '@/pages/admin/AdminDashboard'

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
      }
    ]
  }
]
