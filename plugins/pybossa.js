import * as axios from 'axios'
import localConfig from '@/local.config'

export default (ctx, inject) => {
  let options = {
    baseURL: localConfig.pybossa.host,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: localConfig.pybossa.host,
    data: {}
  }
  const client = axios.create(options)
  const pybossa = {}

  /**
   * Filter microsite categories based on key.
   * @param {Array} categories
   *   The categories.
   * @param {String} key
   *   The microsite key.
   */
  pybossa._filterMicrositeCategories = function (categories, key) {
    return categories.filter(category => {
      return category.info ? category.info.collection === key : false
    })
  }

  /**
   * Get the current user's favourites.
   *
   * http://docs.pybossa.com/en/latest/api.html#favorites
   */
  pybossa.getFavourites = function () {
    return client.get('/api/favourites')
  }

  /**
   * Add a favourite.
   *
   * http://docs.pybossa.com/en/latest/api.html#favorites
   * @param {String|Number} taskId
   *   The task ID.
   */
  pybossa.addFavourite = function (taskId) {
    return client.post('/api/favourites', {
      task_id: taskId
    })
  }

  /**
   * Delete a favourite.
   *
   * http://docs.pybossa.com/en/latest/api.html#favorites
   * @param {String|Number} taskId
   *   The task ID.
   */
  pybossa.deleteFavourite = function (taskId) {
    return client.del(`/api/favourites/${taskId}`)
  }

  /**
   * Get a list of accounts for the given page.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-index
   * @param {String|Number} page
   *   The page.
   */
  pybossa.getAccountIndex = function (page = 1) {
    return client.get(`/account/page/${page}`)
  }

  /**
   * Get the account registration data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-registration
   */
  pybossa.getAccountRegistration = function () {
    return client.get('/account/register')
  }

  /**
   * Register.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-registration
   * @param {Object} form
   *   The form.
   */
  pybossa.register = function (form) {
    return client.post('/account/register', {
      params: form
    })
  }

  /**
   * Get the account signin data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-sign-in
   */
  pybossa.getAccountSignin = function () {
    return client.get('/account/signin')
  }

  /**
   * Sign in.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-sign-in
   * @param {Object} form
   *   The form.
   */
  pybossa.signin = function (form) {
    return client.post('/account/signin', {
      params: form
    })
  }

  /**
   * Sign out.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-sign-out
   */
  pybossa.signout = function () {
    return client.get('/account/signout')
  }

  /**
   * Get the recover password data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-recover-password
   */
  pybossa.getRecoverPassword = function () {
    return client.get('/account/forgot-password')
  }

  /**
   * Recover a password.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-recover-password
   * @param {Object} form
   *   The form.
   */
  pybossa.recoverPassword = function (form) {
    return client.post('/account/forgot-password', {
      params: form
    })
  }

  /**
   * Get the account for the given name.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-name
   * @param {String} name
   *   The username.
   */
  pybossa.getAccount = function (name) {
    return client.get(`/account/${name}/`)
  }

  /**
   * Get the profile of the current user.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-profile
   */
  pybossa.getProfile = function () {
    return client.get(`/account/profile`)
  }

  /**
   * Get the projects belonging to a user.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-projects
   * @param {String} name
   *   The username.
   */
  pybossa.getAccountProjects = function (name) {
    return client.get(`/account/${name}/projects`)
  }

  /**
   * Get the update profile data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-update-profile
   * @param {String} name
   *   The username.
   */
  pybossa.getUpdateProfile = function (name) {
    return client.get(`/account/${name}/update`)
  }

  /**
   * Update a profile.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-update-profile
   * @param {String} name
   *   The username.
   * @param {Object} form
   *   The form.
    * @param {Object} type
  *   The additional form type (Upload, Password, or External).
  */
  pybossa.updateProfile = function (name, form, type) {
    form.btn = type
    return client.post(`/account/${name}/update`, {
      params: form
    })
  }

  /**
   * Get the reset password data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-reset-password
   * @param {String} params
   *   The query params given in the reset link.
   */
  pybossa.getResetPassword = function (params) {
    return client.get('/account/reset-password', {
      params: params
    })
  }

  /**
   * Reset a password.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-reset-password
   * @param {Object} form
   *   The form.
   */
  pybossa.resetPassword = function (form) {
    return client.post('/account/reset-password', {
      params: form
    })
  }

  /**
   * Get the reset API key data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-reset-api-key
   * @param {String} name
   *   The username.
   */
  pybossa.getResetApiKey = function (name) {
    return client.get(`/account/${name}/resetapikey`)
  }

  /**
   * Reset an API key.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-reset-api-key
   * @param {String} name
   *   The username.
   * @param {Object} form
   *   The form.
   */
  pybossa.resetApiKey = function (name, form) {
    return client.post(`/account/${name}/resetapikey`, {
      params: form
    })
  }

  /**
   * Subscribe to the newsletter.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-subscribe-to-newsletter
   */
  pybossa.subscribeToNewsletter = function () {
    return client.get(`/account/newsletter`, {
      params: {
        subscribe: true
      }
    })
  }

  /**
   * Get confirm email data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-confirm-email
   */
  pybossa.getConfirmEmail = function () {
    return client.get('/account/confirm-email')
  }

  /**
   * Confirm an email address.
   * @param {String} params
   *   The query params given in the confirm link.
   */
  pybossa.confirmEmail = function (params) {
    return client.get('/account/register/confirmation', {
      params: params
    })
  }

  /**
   * Get the main leaderboard.
   * @param {String|Number} window
   *   Number of users above and below the current user to show.
   */
  pybossa.getLeaderboard = function (window = 0) {
    return client.get(`leaderboard/window/${window}`)
  }

  /**
   * Get announcments data.
   *
   * http://docs.pybossa.com/en/latest/api.html#announcements
   */
  pybossa.getAnnouncements = function () {
    return client.get(`/announcements`)
  }

  /**
   * Get admin announcments data.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-announcement
   */
  pybossa.getAdminAnnouncements = function () {
    return client.get(`/admin/announcement`)
  }

  /**
   * Get new announcment data.
   *
   * http://docs.pybossa.com/en/latest/api.html#new-announcement
   */
  pybossa.getNewAnnouncement = function () {
    return client.get(`/admin/announcement/new`)
  }

  /**
   * Add a new announcment.
   *
   * http://docs.pybossa.com/en/latest/api.html#new-announcement
   * @param {Object} form
   *   The form.
   */
  pybossa.newAnnouncement = function (form) {
    return client.post(`/admin/announcement/new`, {
      params: form
    })
  }

  /**
   * Get update announcment data.
   *
   * http://docs.pybossa.com/en/latest/api.html#update-announcement
   * @param {String|Number} announcementId
   *   The announcement ID.
   */
  pybossa.getUpdateAnnouncement = function (announcementId) {
    return client.get(`/admin/announcement/${announcementId}/update`)
  }

  /**
   * Update an announcment.
   *
   * http://docs.pybossa.com/en/latest/api.html#update-announcement
   * @param {String|Number} announcementId
   *   The announcement ID.
   * @param {Object} form
   *   The form.
   */
  pybossa.updateAnnouncement = function (announcementId, form) {
    return client.post(`/admin/announcement/${announcementId}/update`, {
      params: form
    })
  }

  /**
   * Get admin users.
   *
   * http://docs.pybossa.com/en/latest/api.html#id9
   */
  pybossa.getAdminUsers = function () {
    return client.get(`/admin/users`)
  }

  /**
   * Search users.
   *
   * http://docs.pybossa.com/en/latest/api.html#id9
   * @param {Object} form
   *   The form.
   */
  pybossa.searchUsers = function (form) {
    return client.post(`/admin/users`, {
      params: form
    })
  }

  /**
   * Add a user to admin.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-users-add
   */
  pybossa.addAdminUser = function (userId) {
    return client.get(`/admin/users/add/${userId}`)
  }

  /**
   * Remove a user from admin.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-users-del
   */
  pybossa.delAdminUser = function (userId) {
    return client.get(`/admin/users/del/${userId}`)
  }

  /**
   * Export users.
   * @param {String} format
   *   The output format (csv or json).
   */
  pybossa.exportUsers = function (format) {
    return client.get(`/admin/users/export`, {
      responseType: 'arraybuffer',
      params: {
        format: format
      }
    })
  }

  /**
   * Get admin categories data.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-categories
   */
  pybossa.getAdminCategories = function () {
    return client.get(`/admin/categories`)
  }

  /**
   * Add a category.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-categories
   * @param {Object} form
   *   The form.
   */
  pybossa.addCategory = function (form) {
    return client.post(`/admin/categories`, { params: form })
  }

  /**
   * Get delete category data.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-categories-delete
   * @param {String|Number} categoryId
   *   The category ID.
   */
  pybossa.getDeleteCategory = function (categoryId) {
    return client.get(`/admin/categories/del/${categoryId}`)
  }

  /**
   * Delete a category.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-categories-delete
   * @param {String|Number} categoryId
   *   The category ID.
   */
  pybossa.deleteCategory = function (categoryId) {
    const endpoint = `/admin/categories/del/${categoryId}`
    return new Promise((resolve, reject) => {
      client.get(endpoint).then(r => {
        return client.post(endpoint, {
          headers: {
            'X-CSRFToken': r.data.form.csrf
          }
        })
      }).then(r => {
        resolve(r)
      })
    })
  }

  /**
   * Get update category data.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-categories-update
   * @param {String|Number} categoryId
   *   The category ID.
   */
  pybossa.getUpdateCategory = function (categoryId) {
    return client.get(`/admin/categories/update/${categoryId}`)
  }

  /**
   * Update a category.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-categories-update
   * @param {String|Number} categoryId
   *   The category ID.
   * @param {Object} form
   *   The form.
   */
  pybossa.updateCategory = function (categoryId, form) {
    return client.post(`/admin/categories/update/${categoryId}`, {
      params: form
    })
  }

  /**
   * Get the admin dashboard.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-dashboard
   */
  pybossa.getAdminDashboard = function () {
    return client.get(`/admin/dashboard`)
  }

  /**
   * Get the admin featured projects data.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-featured
   */
  pybossa.getAdminFeatured = function () {
    return client.get(`/admin/featured`)
  }

  /**
   * Feature a project.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-un-feature-projects
   * @param {String|Number} projectId
   *   The category ID.
   * @param {Object} form
   *   The form.
   */
  pybossa.featureProject = function (projectId, form) {
    return client.post(`/admin/featured/${projectId}`, {
      params: form
    })
  }

  /**
   * Unfeature a project.
   *
   * http://docs.pybossa.com/en/latest/api.html#admin-un-feature-projects
   * @param {String|Number} projectId
   *   The category ID.
   * @param {Object} form
   *   The form.
   */
  pybossa.unfeatureProject = function (projectId, form) {
    return client.del(`/admin/featured/${projectId}`, {
      params: form
    })
  }

  /**
   * Get the API help.
   *
   * http://docs.pybossa.com/en/latest/api.html#help-api
   */
  pybossa.getApiHelp = function () {
    return client.get(`/help/api`)
  }

  /**
   * Get the privacy policy.
   *
   * http://docs.pybossa.com/en/latest/api.html#help-privacy
   */
  pybossa.getPrivacyHelp = function () {
    return client.get(`/help/privacy`)
  }

  /**
   * Get the cookies policy.
   *
   * http://docs.pybossa.com/en/latest/api.html#help-cookie-policy
   */
  pybossa.getCookiesHelp = function () {
    return client.get(`/help/cookies-policy`)
  }

  /**
   * Get the terms of use.
   *
   * http://docs.pybossa.com/en/latest/api.html#help-terms-of-use
   */
  pybossa.getTermsHelp = function () {
    return client.get(`/help/terms-of-use`)
  }

  /**
   * Get the server stats.
   *
   * http://docs.pybossa.com/en/latest/api.html#pybossa-server-stats
   */
  pybossa.getStats = function () {
    return client.get(`stats/`)
  }

  /**
   * Get the server stats summary.
   */
  pybossa.getStatsSummary = function () {
    return client.get(`/api/globalstats`)
  }

  /**
   * Get a category.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-category
   * @param {String} shortname
   *   The category's short name.
   * @param {Number} page
   *   The page number.
   */
  pybossa.getCategory = function (shortname, page = 1) {
    let endpoint = `/project/category/${shortname}/`
    if (page > 1) {
      endpoint += `page/${page}/`
    }
    return client.get(endpoint)
  }

  /**
   * Return the categories for a microsite.
   *
   * This function assumes a limit of 100 categories per microsite.
   * @param {String} key
   *   The microsite key.
   */
  pybossa.getMicrositeCategories = function (key) {
    const url = `/api/category`
    const params = {
      info: `collection::${key}`,
      fulltextsearch: 1
    }
    return new Promise((resolve, reject) => {
      client.get(url, params).then(r => {
        r.data = {
          categories: pybossa._filterMicrositeCategories(r.data, key)
        }
        resolve(r)
      })
    })
  }

  /**
   * Get project data.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-shortname
   * @param {String} shortname
   *   The project's short name.
   */
  pybossa.getProject = function (shortname) {
    return client.get(`/project/${shortname}`)
  }

  /**
   * Get project stats data.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-settings
   * @param {String} shortname
   *   The project's short name.
   */
  pybossa.getProjectStats = function (shortname) {
    return client.get(`/project/${shortname}/stats`)
  }

  /**
   * Get the new project data.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-creation
   */
  pybossa.getNewProject = function () {
    return client.get(`/project/new`)
  }

  /**
   * Add a new project.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-creation
   * @param {Object} form
   *   The form.
   */
  pybossa.newProject = function (form) {
    return client.post(`/project/new`, { params: form })
  }

  /**
   * Get the delete project data.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-delete
   * @param {String} shortname
   *   The project's short name.
   */
  pybossa.getDeleteProject = function (shortname) {
    return client.get(`/project/${shortname}/delete`)
  }

  /**
   * Delete a project.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-delete
   * @param {String} shortname
   *   The project's short name.
   * @param {Object} form
   *   The form.
   */
  pybossa.deleteProject = function (shortname, form) {
    return client.post(`/project/${shortname}/delete`, { params: form })
  }

  /**
   * Get the update project data.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-update
   * @param {String} shortname
   *   The project's short name.
   */
  pybossa.getUpdateProject = function (shortname) {
    return client.get(`/project/${shortname}/update`)
  }

  /**
   * Update a project.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-update
   * @param {String} shortname
   *   The project's short name.
   * @param {Object} form
   *   The form.
   */
  pybossa.updateProject = function (shortname, form) {
    return client.post(`/project/${shortname}/update`, { params: form })
  }

  /**
   * Export the data from a project.
   * @param {String} shortName
   *   The short name of the project.
   * @param {String} type
   *   The domain object.
   * @param {String} format
   *   The output format (csv or json).
   */
  pybossa.exportData = function (shortName, type, format) {
    return client.get(`/project/${shortName}/tasks/export`, {
      responseType: 'arraybuffer',
      params: {
        type: type,
        format: format
      }
    })
  }

  /**
   * Browse tasks.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-tasks-browse
   * @param {String} shortname
   *   The project's short name.
   * @param {String|Number} page
   *   The page number.
   */
  pybossa.getBrowseTasks = function (shortname, page) {
    return client.get(`/project/${shortname}/tasks/browse/${page}`)
  }

  /**
   * Get a task importer.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-tasks-import
   * @param {String} shortname
   *   The project's short name.
   * @param {String} type
   *   The importer type.
   */
  pybossa.getTaskImporter = function (shortname, type) {
    return client.get(`/project/${shortname}/tasks/import`, {
      params: {
        type: type
      }
    })
  }

  /**
   * Import tasks.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-tasks-import
   * @param {String} shortname
   *   The project's short name.
   * @param {Object} form
   *   The form.
   */
  pybossa.importTasks = function (shortname, form) {
    return client.post(`/project/${shortname}/tasks/import`, {
      params: form
    })
  }

  /**
   * Get the project tutorial.
   *
   * http://docs.pybossa.com/en/latest/api.html#project-tutorial
   * @param {String} shortname
   *   The project's short name.
   */
  pybossa.getTutorial = function (shortname) {
    return client.get(`/project/${shortname}/tutorial`)
  }

  // Add the axios client for direct use
  pybossa.client = client

  // Inject $pybossa into the context
  ctx.$pybossa = pybossa
  inject('pybossa', pybossa)

  // Return mainly for testing
  return pybossa
}
