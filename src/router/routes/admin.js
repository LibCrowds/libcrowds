import DashboardLayout from '@/layouts/Dashboard'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import Administrators from '@/pages/admin/Administrators'
import Publications from '@/pages/admin/Publications'
import Categories from '@/pages/admin/Categories'
import EditCategory from '@/pages/admin/EditCategory'
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
        name: 'admin-publications',
        component: Publications
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: Categories
      },
      {
        path: 'categories/update/:categoryid',
        name: 'admin-edit-category',
        component: EditCategory
      },
      {
        path: 'featured',
        name: 'admin-featured',
        component: Featured
      }
    ]
  }
]
