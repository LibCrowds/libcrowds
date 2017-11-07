export const routes = [
  {
    path: '/',
    component: jest.fn(),
    name: 'index'
  },
  {
    path: '/admin/site/collections',
    component: jest.fn(),
    name: 'admin-site-collections'
  },
  {
    path: '/help/privacy',
    component: jest.fn(),
    name: 'help-privacy'
  },
  {
    path: '/admin/site/dashboard',
    component: jest.fn(),
    name: 'admin-site-dashboard'
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
    path: '/admin/site/featured',
    component: jest.fn(),
    name: 'admin-site-featured'
  },
  {
    path: '/admin/site/announcements',
    component: jest.fn(),
    name: 'admin-site-announcements'
  },
  {
    path: '/help/tos',
    component: jest.fn(),
    name: 'help-tos'
  },
  {
    path: '/admin/site/jobs',
    component: jest.fn(),
    name: 'admin-site-jobs'
  },
  {
    path: '/help/api',
    component: jest.fn(),
    name: 'help-api'
  },
  {
    path: '/admin/site/users',
    component: jest.fn(),
    name: 'admin-site-users'
  },
  {
    path: '/help/cookies',
    component: jest.fn(),
    name: 'help-cookies'
  },
  {
    path: '/admin/site/announcements/new',
    component: jest.fn(),
    name: 'admin-site-announcements-new'
  },
  {
    path: '/account/password/reset',
    component: jest.fn(),
    name: 'account-password-reset'
  },
  {
    path: '/admin/site/collections/new',
    component: jest.fn(),
    name: 'admin-site-collections-new'
  },
  {
    path: '/account/password/forgotten',
    component: jest.fn(),
    name: 'account-password-forgotten'
  },
  {
    path: '/admin/site/announcements/:id/update',
    component: jest.fn(),
    name: 'admin-site-announcements-id-update'
  },
  {
    path: '/admin/site/collections/:id/update',
    component: jest.fn(),
    name: 'admin-site-collections-id-update'
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
    path: '/admin/project/:short_name?/thumbnail',
    component: jest.fn(),
    name: 'admin-project-short_name-thumbnail'
  },
  {
    path: '/admin/project/:short_name?/tags',
    component: jest.fn(),
    name: 'admin-project-short_name-tags'
  },
  {
    path: '/admin/project/:short_name?/settings',
    component: jest.fn(),
    name: 'admin-project-short_name-settings'
  },
  {
    path: '/admin/project/open',
    component: jest.fn(),
    name: 'admin-project-open'
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
