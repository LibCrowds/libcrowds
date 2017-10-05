import DashboardLayout from '@/layouts/Dashboard'

import AdminDashboard from '@/pages/admin/AdminDashboard'
import Users from '@/pages/admin/Users'
import Announcements from '@/pages/admin/Announcements'
import NewAnnouncement from '@/pages/admin/NewAnnouncement'
import UpdateAnnouncement from '@/pages/admin/UpdateAnnouncement'
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
          id: 'announcements',
          label: 'Announcements',
          link: {
            name: 'admin-announcements'
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
        beforeEnter (to, from, next) {
          next({ name: 'admin-dashboard' })
        }
      },
      {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: AdminDashboard
      },
      {
        path: 'users',
        name: 'admin-users',
        component: Users
      },
      {
        path: 'announcements',
        name: 'admin-announcements',
        component: Announcements
      },
      {
        path: 'announcements/:id/update',
        name: 'admin-announcement-update',
        component: UpdateAnnouncement
      },
      {
        path: 'announcements/new',
        name: 'admin-announcement-new',
        component: NewAnnouncement
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: Categories
      },
      {
        path: 'categories/update/:categoryid',
        name: 'admin-categories-update',
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
