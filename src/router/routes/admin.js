import DashboardLayout from '@/layouts/Dashboard'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import Users from '@/pages/admin/Users'
import Publications from '@/pages/admin/Publications'
import Categories from '@/pages/admin/Categories'
import EditCategory from '@/pages/admin/EditCategory'
import Featured from '@/pages/admin/Featured'
import BackgroundJobs from '@/pages/admin/BackgroundJobs'

export default [
  {
    path: '/admin',
    component: DashboardLayout,
    props: {
      dashboardNavItems: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          link: {
            name: 'admin-dashboard'
          }
        },
        {
          id: 'featured',
          label: 'Featured Projects',
          link: {
            name: 'admin-featured'
          }
        },
        {
          id: 'categories',
          label: 'Categories',
          link: {
            name: 'admin-categories'
          }
        },
        {
          id: 'users',
          label: 'Users',
          link: {
            name: 'admin-users'
          }
        },
        {
          id: 'publications',
          label: 'Publications',
          link: {
            name: 'admin-publications'
          }
        },
        {
          id: 'background-jobs',
          label: 'Background Jobs',
          link: {
            name: 'admin-background-jobs'
          }
        }
      ]
    },
    children: [
      {
        path: '/',
        name: 'admin-dashboard',
        component: AdminDashboard
      },
      {
        path: 'users',
        name: 'admin-users',
        component: Users
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
      },
      {
        path: 'jobs',
        name: 'admin-background-jobs',
        component: BackgroundJobs
      }
    ]
  }
]
