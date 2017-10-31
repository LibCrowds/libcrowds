export const routes = [
  {
    path: '/',
    component: jest.fn(),
    name: 'index'
  },
  {
    path: '/admin/collections',
    component: jest.fn(),
    name: 'admin-collections'
  },
  {
    path: '/help/privacy',
    component: jest.fn(),
    name: 'help-privacy'
  },
  {
    path: '/admin/dashboard',
    component: jest.fn(),
    name: 'admin-dashboard'
  },
  {
    path: '/account/signin',
    component: jest.fn(),
    name: 'account-signin'
  },
  {
    path: '/account/newsletter',
    component: jest.fn(),
    name: 'account-newsletter'
  },
  {
    path: '/account/register',
    component: jest.fn(),
    name: 'account-register'
  },
  {
    path: '/admin/featured',
    component: jest.fn(),
    name: 'admin-featured'
  },
  {
    path: '/admin/announcements',
    component: jest.fn(),
    name: 'admin-announcements'
  },
  {
    path: '/help/tos',
    component: jest.fn(),
    name: 'help-tos'
  },
  {
    path: '/admin/jobs',
    component: jest.fn(),
    name: 'admin-jobs'
  },
  {
    path: '/help/api',
    component: jest.fn(),
    name: 'help-api'
  },
  {
    path: '/admin/users',
    component: jest.fn(),
    name: 'admin-users'
  },
  {
    path: '/help/cookies',
    component: jest.fn(),
    name: 'help-cookies'
  },
  {
    path: '/admin/announcements/new',
    component: jest.fn(),
    name: 'admin-announcements-new'
  },
  {
    path: '/account/password/reset',
    component: jest.fn(),
    name: 'account-password-reset'
  },
  {
    path: '/admin/collections/new',
    component: jest.fn(),
    name: 'admin-collections-new'
  },
  {
    path: '/account/password/forgotten',
    component: jest.fn(),
    name: 'account-password-forgotten'
  },
  {
    path: '/admin/announcements/:id/update',
    component: jest.fn(),
    name: 'admin-announcements-id-update'
  },
  {
    path: '/admin/collections/:id/update',
    component: jest.fn(),
    name: 'admin-collections-id-update'
  },
  {
    path: '/account/:name?',
    component: jest.fn(),
    name: 'account-name'
  },
  {
    path: '/collection/:short_name?',
    component: jest.fn(),
    name: 'collection-short_name'
  },
  {
    path: '/collection/:short_name?/projects',
    component: jest.fn(),
    name: 'collection-short_name-projects'
  },
  {
    path: '/project/:short_name?/thumbnail',
    component: jest.fn(),
    name: 'project-short_name-thumbnail'
  },
  {
    path: '/project/:short_name?/tags',
    component: jest.fn(),
    name: 'project-short_name-tags'
  },
  {
    path: '/project/:short_name?/settings',
    component: jest.fn(),
    name: 'project-short_name-settings'
  },
  {
    path: '/account/:name?/projects',
    component: jest.fn(),
    name: 'account-name-projects'
  },
  {
    path: '/account/:name?/announcements',
    component: jest.fn(),
    name: 'account-name-announcements'
  },
  {
    path: '/collection/:short_name?/about',
    component: jest.fn(),
    name: 'collection-short_name-about'
  },
  {
    path: '/collection/:short_name?/data',
    component: jest.fn(),
    name: 'collection-short_name-data'
  },
  {
    path: '/account/:name?/settings/avatar',
    component: jest.fn(),
    name: 'account-name-settings-avatar'
  },
  {
    path: '/account/:name?/settings/api',
    component: jest.fn(),
    name: 'account-name-settings-api'
  },
  {
    path: '/account/:name?/settings/profile',
    component: jest.fn(),
    name: 'account-name-settings-profile'
  },
  {
    path: '/account/:name?/settings/security',
    component: jest.fn(),
    name: 'account-name-settings-security'
  },
  {
    path: '/collection/:short_name?/projects/:id',
    component: jest.fn(),
    name: 'collection-short_name-projects-id'
  }
]
