import axios from 'axios'
import localConfig from '../local.config'

const pybossaPlugin = {
  install () {
    if (Vue.__nuxt_pybossa_installed__) {
      return
    }
    Vue.__nuxt_pybossa_installed__ = true

    const options = {
      baseURL: localConfig.host,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: localConfig.host,
      data: {}
    }
    const client = axios.create(options)
    const pybossa = {}

    if (!Vue.prototype.$pybossa) {
      Vue.prototype.$pybossa = {

        /**
         * Filter microsite categories based on key.
         * @param {Array} categories
         *   The categories.
         * @param {String} key
         *   The microsite key.
         */
        _filterMicrositeCategories (categories, key) {
          return categories.filter(category => {
            return category.info ? category.info.collection === key : false
          })
        },

        /**
         * Get the current user's favourites.
         *
         * http://docs.com/en/latest/api.html#favorites
         */
        getFavourites () {
          return client.get('/api/favourites')
        },

        /**
         * Add a favourite.
         *
         * http://docs.com/en/latest/api.html#favorites
         * @param {String|Number} taskId
         *   The task ID.
         */
        addFavourite (taskId) {
          return client.post('/api/favourites', {
            task_id: taskId
          })
        },

        /**
         * Delete a favourite.
         *
         * http://docs.com/en/latest/api.html#favorites
         * @param {String|Number} taskId
         *   The task ID.
         */
        deleteFavourite (taskId) {
          return client.del(`/api/favourites/${taskId}`)
        },

        /**
         * Get a list of accounts for the given page.
         *
         * http://docs.com/en/latest/api.html#account-index
         * @param {String|Number} page
         *   The page.
         */
        getAccountIndex (page = 1) {
          return client.get(`/account/page/${page}`)
        },

        /**
         * Get the account registration data.
         *
         * http://docs.com/en/latest/api.html#account-registration
         */
        getAccountRegistration () {
          return client.get('/account/register')
        },

        /**
         * Register.
         *
         * http://docs.com/en/latest/api.html#account-registration
         * @param {Object} form
         *   The form.
         */
        register (form) {
          return client.post('/account/register', {
            params: form
          })
        },

        /**
         * Get the account signin data.
         *
         * http://docs.com/en/latest/api.html#account-sign-in
         */
        getAccountSignin () {
          return client.get('/account/signin')
        },

        /**
         * Sign in.
         *
         * http://docs.com/en/latest/api.html#account-sign-in
         * @param {Object} form
         *   The form.
         */
        signin (form) {
          return client.post('/account/signin', {
            params: form
          })
        },

        /**
         * Sign out.
         *
         * http://docs.com/en/latest/api.html#account-sign-out
         */
        signout () {
          return client.get('/account/signout')
        },

        /**
         * Get the recover password data.
         *
         * http://docs.com/en/latest/api.html#account-recover-password
         */
        getRecoverPassword () {
          return client.get('/account/forgot-password')
        },

        /**
         * Recover a password.
         *
         * http://docs.com/en/latest/api.html#account-recover-password
         * @param {Object} form
         *   The form.
         */
        recoverPassword (form) {
          return client.post('/account/forgot-password', {
            params: form
          })
        },

        /**
         * Get the account for the given name.
         *
         * http://docs.com/en/latest/api.html#account-name
         * @param {String} name
         *   The username.
         */
        getAccount (name) {
          return client.get(`/account/${name}/`)
        },

        /**
         * Get the profile of the current user.
         *
         * http://docs.com/en/latest/api.html#account-profile
         */
        getProfile () {
          return client.get(`/account/profile`)
        },

        /**
         * Get the projects belonging to a user.
         *
         * http://docs.com/en/latest/api.html#account-projects
         * @param {String} name
         *   The username.
         */
        getAccountProjects (name) {
          return client.get(`/account/${name}/projects`)
        },

        /**
         * Get the update profile data.
         *
         * http://docs.com/en/latest/api.html#account-update-profile
         * @param {String} name
         *   The username.
         */
        getUpdateProfile (name) {
          return client.get(`/account/${name}/update`)
        },

        /**
         * Update a profile.
         *
         * http://docs.com/en/latest/api.html#account-update-profile
         * @param {String} name
         *   The username.
         * @param {Object} form
         *   The form.
          * @param {Object} type
        *   The additional form type (Upload, Password, or External).
        */
        updateProfile (name, form, type) {
          form.btn = type
          return client.post(`/account/${name}/update`, {
            params: form
          })
        },

        /**
         * Get the reset password data.
         *
         * http://docs.com/en/latest/api.html#account-reset-password
         * @param {String} params
         *   The query params given in the reset link.
         */
        getResetPassword (params) {
          return client.get('/account/reset-password', {
            params: params
          })
        },

        /**
         * Reset a password.
         *
         * http://docs.com/en/latest/api.html#account-reset-password
         * @param {Object} form
         *   The form.
         */
        resetPassword (form) {
          return client.post('/account/reset-password', {
            params: form
          })
        },

        /**
         * Get the reset API key data.
         *
         * http://docs.com/en/latest/api.html#account-reset-api-key
         * @param {String} name
         *   The username.
         */
        getResetApiKey (name) {
          return client.get(`/account/${name}/resetapikey`)
        },

        /**
         * Reset an API key.
         *
         * http://docs.com/en/latest/api.html#account-reset-api-key
         * @param {String} name
         *   The username.
         * @param {Object} form
         *   The form.
         */
        resetApiKey (name, form) {
          return client.post(`/account/${name}/resetapikey`, {
            params: form
          })
        },

        /**
         * Subscribe to the newsletter.
         *
         * http://docs.com/en/latest/api.html#account-subscribe-to-newsletter
         */
        subscribeToNewsletter () {
          return client.get(`/account/newsletter`, {
            params: {
              subscribe: true
            }
          })
        },

        /**
         * Get confirm email data.
         *
         * http://docs.com/en/latest/api.html#account-confirm-email
         */
        getConfirmEmail () {
          return client.get('/account/confirm-email')
        },

        /**
         * Confirm an email address.
         * @param {String} params
         *   The query params given in the confirm link.
         */
        confirmEmail (params) {
          return client.get('/account/register/confirmation', {
            params: params
          })
        },

        /**
         * Get the main leaderboard.
         * @param {String|Number} window
         *   Number of users above and below the current user to show.
         */
        getLeaderboard (window = 0) {
          return client.get(`leaderboard/window/${window}`)
        },

        /**
         * Get announcments data.
         *
         * http://docs.com/en/latest/api.html#announcements
         */
        getAnnouncements () {
          return client.get(`/announcements`)
        },

        /**
         * Get admin announcments data.
         *
         * http://docs.com/en/latest/api.html#admin-announcement
         */
        getAdminAnnouncements () {
          return client.get(`/admin/announcement`)
        },

        /**
         * Get new announcment data.
         *
         * http://docs.com/en/latest/api.html#new-announcement
         */
        getNewAnnouncement () {
          return client.get(`/admin/announcement/new`)
        },

        /**
         * Add a new announcment.
         *
         * http://docs.com/en/latest/api.html#new-announcement
         * @param {Object} form
         *   The form.
         */
        newAnnouncement (form) {
          return client.post(`/admin/announcement/new`, {
            params: form
          })
        },

        /**
         * Get update announcment data.
         *
         * http://docs.com/en/latest/api.html#update-announcement
         * @param {String|Number} announcementId
         *   The announcement ID.
         */
        getUpdateAnnouncement (announcementId) {
          return client.get(`/admin/announcement/${announcementId}/update`)
        },

        /**
         * Update an announcment.
         *
         * http://docs.com/en/latest/api.html#update-announcement
         * @param {String|Number} announcementId
         *   The announcement ID.
         * @param {Object} form
         *   The form.
         */
        updateAnnouncement (announcementId, form) {
          return client.post(`/admin/announcement/${announcementId}/update`, {
            params: form
          })
        },

        /**
         * Get admin users.
         *
         * http://docs.com/en/latest/api.html#id9
         */
        getAdminUsers () {
          return client.get(`/admin/users`)
        },

        /**
         * Search users.
         *
         * http://docs.com/en/latest/api.html#id9
         * @param {Object} form
         *   The form.
         */
        searchUsers (form) {
          return client.post(`/admin/users`, {
            params: form
          })
        },

        /**
         * Add a user to admin.
         *
         * http://docs.com/en/latest/api.html#admin-users-add
         */
        addAdminUser (userId) {
          return client.get(`/admin/users/add/${userId}`)
        },

        /**
         * Remove a user from admin.
         *
         * http://docs.com/en/latest/api.html#admin-users-del
         */
        delAdminUser (userId) {
          return client.get(`/admin/users/del/${userId}`)
        },

        /**
         * Export users.
         * @param {String} format
         *   The output format (csv or json).
         */
        exportUsers (format) {
          return client.get(`/admin/users/export`, {
            responseType: 'arraybuffer',
            params: {
              format: format
            }
          })
        },

        /**
         * Get admin categories data.
         *
         * http://docs.com/en/latest/api.html#admin-categories
         */
        getAdminCategories () {
          return client.get(`/admin/categories`)
        },

        /**
         * Add a category.
         *
         * http://docs.com/en/latest/api.html#admin-categories
         * @param {Object} form
         *   The form.
         */
        addCategory (form) {
          return client.post(`/admin/categories`, { params: form })
        },

        /**
         * Get delete category data.
         *
         * http://docs.com/en/latest/api.html#admin-categories-delete
         * @param {String|Number} categoryId
         *   The category ID.
         */
        getDeleteCategory (categoryId) {
          return client.get(`/admin/categories/del/${categoryId}`)
        },

        /**
         * Delete a category.
         *
         * http://docs.com/en/latest/api.html#admin-categories-delete
         * @param {String|Number} categoryId
         *   The category ID.
         */
        deleteCategory (categoryId) {
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
        },

        /**
         * Get update category data.
         *
         * http://docs.com/en/latest/api.html#admin-categories-update
         * @param {String|Number} categoryId
         *   The category ID.
         */
        getUpdateCategory (categoryId) {
          return client.get(`/admin/categories/update/${categoryId}`)
        },

        /**
         * Update a category.
         *
         * http://docs.com/en/latest/api.html#admin-categories-update
         * @param {String|Number} categoryId
         *   The category ID.
         * @param {Object} form
         *   The form.
         */
        updateCategory (categoryId, form) {
          return client.post(`/admin/categories/update/${categoryId}`, {
            params: form
          })
        },

        /**
         * Get the admin dashboard.
         *
         * http://docs.com/en/latest/api.html#admin-dashboard
         */
        getAdminDashboard () {
          return client.get(`/admin/dashboard`)
        },

        /**
         * Get the admin featured projects data.
         *
         * http://docs.com/en/latest/api.html#admin-featured
         */
        getAdminFeatured () {
          return client.get(`/admin/featured`)
        },

        /**
         * Feature a project.
         *
         * http://docs.com/en/latest/api.html#admin-un-feature-projects
         * @param {String|Number} projectId
         *   The category ID.
         * @param {Object} form
         *   The form.
         */
        featureProject (projectId, form) {
          return client.post(`/admin/featured/${projectId}`, {
            params: form
          })
        },

        /**
         * Unfeature a project.
         *
         * http://docs.com/en/latest/api.html#admin-un-feature-projects
         * @param {String|Number} projectId
         *   The category ID.
         * @param {Object} form
         *   The form.
         */
        unfeatureProject (projectId, form) {
          return client.del(`/admin/featured/${projectId}`, {
            params: form
          })
        },

        /**
         * Get the API help.
         *
         * http://docs.com/en/latest/api.html#help-api
         */
        getApiHelp () {
          return client.get(`/help/api`)
        },

        /**
         * Get the privacy policy.
         *
         * http://docs.com/en/latest/api.html#help-privacy
         */
        getPrivacyHelp () {
          return client.get(`/help/privacy`)
        },

        /**
         * Get the cookies policy.
         *
         * http://docs.com/en/latest/api.html#help-cookie-policy
         */
        getCookiesHelp () {
          return client.get(`/help/cookies-policy`)
        },

        /**
         * Get the terms of use.
         *
         * http://docs.com/en/latest/api.html#help-terms-of-use
         */
        getTermsHelp () {
          return client.get(`/help/terms-of-use`)
        },

        /**
         * Get the server stats.
         *
         * http://docs.com/en/latest/api.html#pybossa-server-stats
         */
        getStats () {
          return client.get(`stats/`)
        },

        /**
         * Get the server stats summary.
         */
        getStatsSummary () {
          return client.get(`/api/globalstats`)
        },

        /**
         * Get a category.
         *
         * http://docs.com/en/latest/api.html#project-category
         * @param {String} shortname
         *   The category's short name.
         * @param {Number} page
         *   The page number.
         */
        getCategory (shortname, page = 1) {
          let endpoint = `/project/category/${shortname}/`
          if (page > 1) {
            endpoint += `page/${page}/`
          }
          return client.get(endpoint)
        },

        /**
         * Return the categories for a microsite.
         *
         * This function assumes a limit of 100 categories per microsite.
         * @param {String} key
         *   The microsite key.
         */
        getMicrositeCategories (key) {
          const url = `/api/category`
          const params = {
            info: `collection::${key}`,
            fulltextsearch: 1
          }
          return new Promise((resolve, reject) => {
            client.get(url, params).then(r => {
              r.data = {
                categories: _filterMicrositeCategories(r.data, key)
              }
              resolve(r)
            })
          })
        },

        /**
         * Get project data.
         *
         * http://docs.com/en/latest/api.html#project-shortname
         * @param {String} shortname
         *   The project's short name.
         */
        getProject (shortname) {
          return client.get(`/project/${shortname}`)
        },

        /**
         * Get project stats data.
         *
         * http://docs.com/en/latest/api.html#project-settings
         * @param {String} shortname
         *   The project's short name.
         */
        getProjectStats (shortname) {
          return client.get(`/project/${shortname}/stats`)
        },

        /**
         * Get the new project data.
         *
         * http://docs.com/en/latest/api.html#project-creation
         */
        getNewProject () {
          return client.get(`/project/new`)
        },

        /**
         * Add a new project.
         *
         * http://docs.com/en/latest/api.html#project-creation
         * @param {Object} form
         *   The form.
         */
        newProject (form) {
          return client.post(`/project/new`, { params: form })
        },

        /**
         * Get the delete project data.
         *
         * http://docs.com/en/latest/api.html#project-delete
         * @param {String} shortname
         *   The project's short name.
         */
        getDeleteProject (shortname) {
          return client.get(`/project/${shortname}/delete`)
        },

        /**
         * Delete a project.
         *
         * http://docs.com/en/latest/api.html#project-delete
         * @param {String} shortname
         *   The project's short name.
         * @param {Object} form
         *   The form.
         */
        deleteProject (shortname, form) {
          return client.post(`/project/${shortname}/delete`, { params: form })
        },

        /**
         * Get the update project data.
         *
         * http://docs.com/en/latest/api.html#project-update
         * @param {String} shortname
         *   The project's short name.
         */
        getUpdateProject (shortname) {
          return client.get(`/project/${shortname}/update`)
        },

        /**
         * Update a project.
         *
         * http://docs.com/en/latest/api.html#project-update
         * @param {String} shortname
         *   The project's short name.
         * @param {Object} form
         *   The form.
         */
        updateProject (shortname, form) {
          return client.post(`/project/${shortname}/update`, { params: form })
        },

        /**
         * Export the data from a project.
         * @param {String} shortName
         *   The short name of the project.
         * @param {String} type
         *   The domain object.
         * @param {String} format
         *   The output format (csv or json).
         */
        exportData (shortName, type, format) {
          return client.get(`/project/${shortName}/tasks/export`, {
            responseType: 'arraybuffer',
            params: {
              type: type,
              format: format
            }
          })
        },

        /**
         * Browse tasks.
         *
         * http://docs.com/en/latest/api.html#project-tasks-browse
         * @param {String} shortname
         *   The project's short name.
         * @param {String|Number} page
         *   The page number.
         */
        getBrowseTasks (shortname, page) {
          return client.get(`/project/${shortname}/tasks/browse/${page}`)
        },

        /**
         * Get a task importer.
         *
         * http://docs.com/en/latest/api.html#project-tasks-import
         * @param {String} shortname
         *   The project's short name.
         * @param {String} type
         *   The importer type.
         */
        getTaskImporter (shortname, type) {
          return client.get(`/project/${shortname}/tasks/import`, {
            params: {
              type: type
            }
          })
        },

        /**
         * Import tasks.
         *
         * http://docs.com/en/latest/api.html#project-tasks-import
         * @param {String} shortname
         *   The project's short name.
         * @param {Object} form
         *   The form.
         */
        importTasks (shortname, form) {
          return client.post(`/project/${shortname}/tasks/import`, {
            params: form
          })
        },

        /**
         * Get the project tutorial.
         *
         * http://docs.com/en/latest/api.html#project-tutorial
         * @param {String} shortname
         *   The project's short name.
         */
        getTutorial (shortname) {
          return client.get(`/project/${shortname}/tutorial`)
        },

        // Add the axios client for direct use
        client: client
      }
    }
  }
}

Vue.use(pybossaPlugin)

export default (ctx) => {
  const { app, store } = ctx

  app.$pybossa = Vue.prototype.$pybossa
  ctx.$pybossa = Vue.prototype.$pybossa
  if (store) {
    store.$pybossa = Vue.prototype.$pybossa
  }
}
