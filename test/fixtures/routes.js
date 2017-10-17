export const routes = [
  {
    path: '/',
    component: jest.fn(),
    name: 'index'
  },
  {
    path: '/admin/announcements',
    component: jest.fn(),
    name: 'admin-announcements'
  },
  {
    path: '/account/newsletter',
    component: jest.fn(),
    name: 'account-newsletter'
  },
  {
    path: '/help/privacy',
    component: jest.fn(),
    name: 'help-privacy'
  },
  {
    path: '/admin/jobs',
    component: jest.fn(),
    name: 'admin-jobs'
  },
  {
    path: '/help/tos',
    component: jest.fn(),
    name: 'help-tos'
  },
  {
    path: '/account/signin',
    component: jest.fn(),
    name: 'account-signin'
  },
  {
    path: '/admin/featured',
    component: jest.fn(),
    name: 'admin-featured'
  },
  {
    path: '/admin/dashboard',
    component: jest.fn(),
    name: 'admin-dashboard'
  },
  {
    path: '/admin/categories',
    component: jest.fn(),
    name: 'admin-categories'
  },
  {
    path: '/admin/users',
    component: jest.fn(),
    name: 'admin-users'
  },
  {
    path: '/help/api',
    component: jest.fn(),
    name: 'help-api'
  },
  {
    path: '/help/cookies',
    component: jest.fn(),
    name: 'help-cookies'
  },
  {
    path: '/account/register',
    component: jest.fn(),
    name: 'account-register'
  },
  {
    path: '/account/password/reset',
    component: jest.fn(),
    name: 'account-password-reset'
  },
  {
    path: '/account/password/forgotten',
    component: jest.fn(),
    name: 'account-password-forgotten'
  },
  {
    path: '/admin/announcements/new',
    component: jest.fn(),
    name: 'admin-announcements-new'
  },
  {
    path: '/admin/collections/new',
    component: jest.fn(),
    name: 'admin-collections-new'
  },
  {
    path: '/admin/categories/:id/edit',
    component: jest.fn(),
    name: 'admin-categories-id-edit'
  },
  {
    path: '/admin/announcements/:id/update',
    component: jest.fn(),
    name: 'admin-announcements-id-update'
  },
  {
    path: '/collection/:key?',
    component: jest.fn(),
    name: 'collection-key'
  },
  {
    path: '/account/:username?',
    component: jest.fn(),
    name: 'account-username'
  },
  {
    path: '/collection/:name?',
    component: jest.fn(),
    name: 'collection-name'
  },
  {
    path: '/collection/:key?/presenter',
    component: jest.fn(),
    name: 'collection-key-presenter'
  },
  {
    path: '/collection/:key?/data',
    component: jest.fn(),
    name: 'collection-key-data'
  },
  {
    path: '/project/:shortname?/thumbnail',
    component: jest.fn(),
    name: 'project-shortname-thumbnail'
  },
  {
    path: '/collection/:key?/contribute',
    component: jest.fn(),
    name: 'collection-key-contribute'
  },
  {
    path: '/project/:shortname?/settings',
    component: jest.fn(),
    name: 'project-shortname-settings'
  },
  {
    path: '/collection/:name?/contribute',
    component: jest.fn(),
    name: 'collection-name-contribute'
  },
  {
    path: '/account/:username?/projects',
    component: jest.fn(),
    name: 'account-username-projects'
  },
  {
    path: '/collection/:name?/presenter',
    component: jest.fn(),
    name: 'collection-name-presenter'
  },
  {
    path: '/collection/:key?/about',
    component: jest.fn(),
    name: 'collection-key-about'
  },
  {
    path: '/account/:username?/settings/security',
    component: jest.fn(),
    name: 'account-username-settings-security'
  },
  {
    path: '/account/:username?/settings/avatar',
    component: jest.fn(),
    name: 'account-username-settings-avatar'
  },
  {
    path: '/account/:username?/settings/api',
    component: jest.fn(),
    name: 'account-username-settings-api'
  },
  {
    path: '/account/:username?/settings/profile',
    component: jest.fn(),
    name: 'account-username-settings-profile'
  }
]