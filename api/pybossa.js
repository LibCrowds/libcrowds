import axios from 'axios'
import localConfig from '@/local.config'
import addCsrfHeader from '@/api/interceptors/addCsrfHeader'
import handleErrors from '@/api/interceptors/handleErrors'
import handleFlash from '@/api/interceptors/handleFlash'

const PyBossaApi = {
  _instance: null,
  get instance () {
    if (!this._instance) {
      this._instance = {
        client: axios.create({
          baseURL: localConfig.pybossa.host,
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: localConfig.pybossa.timeout,
          data: {} // Otherwise Content-Type gets deleted
        }),

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
         * http://docs.pybossa.com/en/latest/api.html#favorites
         */
        getFavourites () {
          return this.client.get('/api/favourites')
        },

        /**
         * Add a favourite.
         *
         * http://docs.pybossa.com/en/latest/api.html#favorites
         * @param {String|Number} taskId
         *   The task ID.
         */
        addFavourite (taskId) {
          return this.client.post('/api/favourites', {
            task_id: taskId
          })
        },

        /**
         * Delete a favourite.
         *
         * http://docs.pybossa.com/en/latest/api.html#favorites
         * @param {String|Number} taskId
         *   The task ID.
         */
        deleteFavourite (taskId) {
          return this.client.del(`/api/favourites/${taskId}`)
        },

        /**
         * Get a list of accounts for the given page.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-index
         * @param {String|Number} page
         *   The page.
         */
        getAccountIndex (page = 1) {
          return this.client.get(`/account/page/${page}`)
        },

        /**
         * Get the account registration data.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-registration
         */
        getAccountRegistration () {
          return this.client.get('/account/register')
        },

        /**
         * Register.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-registration
         * @param {Object} form
         *   The form.
         */
        register (form) {
          return this.client.post('/account/register', {
            params: form
          })
        },

        /**
         * Get the account signin data.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-sign-in
         */
        getAccountSignin () {
          return this.client.get('/account/signin')
        },

        /**
         * Sign in.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-sign-in
         * @param {Object} form
         *   The form.
         */
        signin (form) {
          return this.client.post('/account/signin', {
            params: form
          })
        },

        /**
         * Sign out.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-sign-out
         */
        signout () {
          return this.client.get('/account/signout')
        },

        /**
         * Get the recover password data.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-recover-password
         */
        getRecoverPassword () {
          return this.client.get('/account/forgot-password')
        },

        /**
         * Recover a password.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-recover-password
         * @param {Object} form
         *   The form.
         */
        recoverPassword (form) {
          return this.client.post('/account/forgot-password', {
            params: form
          })
        },

        /**
         * Get the account for the given name.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-name
         * @param {String} name
         *   The username.
         */
        getAccount (name) {
          return this.client.get(`/account/${name}/`)
        },

        /**
         * Get the profile of the current user.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-profile
         */
        getProfile () {
          return this.client.get(`/account/profile`)
        },

        /**
         * Get the projects belonging to a user.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-projects
         * @param {String} name
         *   The username.
         */
        getAccountProjects (name) {
          return this.client.get(`/account/${name}/projects`)
        },

        /**
         * Get the update profile data.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-update-profile
         * @param {String} name
         *   The username.
         */
        getUpdateProfile (name) {
          return this.client.get(`/account/${name}/update`)
        },

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
        updateProfile (name, form, type) {
          form.btn = type
          return this.client.post(`/account/${name}/update`, {
            params: form
          })
        },

        /**
         * Get the reset password data.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-reset-password
         * @param {String} params
         *   The query params given in the reset link.
         */
        getResetPassword (params) {
          return this.client.get('/account/reset-password', {
            params: params
          })
        },

        /**
         * Reset a password.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-reset-password
         * @param {Object} form
         *   The form.
         */
        resetPassword (form) {
          return this.client.post('/account/reset-password', {
            params: form
          })
        },

        /**
         * Get the reset API key data.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-reset-api-key
         * @param {String} name
         *   The username.
         */
        getResetApiKey (name) {
          return this.client.get(`/account/${name}/resetapikey`)
        },

        /**
         * Reset an API key.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-reset-api-key
         * @param {String} name
         *   The username.
         * @param {Object} form
         *   The form.
         */
        resetApiKey (name, form) {
          return this.client.post(`/account/${name}/resetapikey`, {
            params: form
          })
        },

        /**
         * Subscribe to the newsletter.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-subscribe-to-newsletter
         * @param {Boolean} subscribe
         *   True to subscribe, false otherwise.
         */
        subscribeToNewsletter (subscribe) {
          return this.client.get(`/account/newsletter`, {
            params: {
              subscribe: subscribe ? 'True' : 'False'
            }
          })
        },

        /**
         * Get confirm email data.
         *
         * http://docs.pybossa.com/en/latest/api.html#account-confirm-email
         */
        getConfirmEmail () {
          return this.client.get('/account/confirm-email')
        },

        /**
         * Confirm an email address.
         * @param {String} params
         *   The query params given in the confirm link.
         */
        confirmEmail (params) {
          return this.client.get('/account/register/confirmation', {
            params: params
          })
        },

        /**
         * Get the main leaderboard.
         * @param {String|Number} window
         *   Number of users above and below the current user to show.
         */
        getLeaderboard (window = 0) {
          return this.client.get(`leaderboard/window/${window}`)
        },

        /**
         * Get announcments data.
         *
         * http://docs.pybossa.com/en/latest/api.html#announcements
         */
        getAnnouncements () {
          return this.client.get(`/announcements`)
        },

        /**
         * Get admin announcments data.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-announcement
         */
        getAdminAnnouncements () {
          return this.client.get(`/admin/announcement`)
        },

        /**
         * Get new announcment data.
         *
         * http://docs.pybossa.com/en/latest/api.html#new-announcement
         */
        getNewAnnouncement () {
          return this.client.get(`/admin/announcement/new`)
        },

        /**
         * Add a new announcment.
         *
         * http://docs.pybossa.com/en/latest/api.html#new-announcement
         * @param {Object} form
         *   The form.
         */
        newAnnouncement (form) {
          return this.client.post(`/admin/announcement/new`, {
            params: form
          })
        },

        /**
         * Get update announcment data.
         *
         * http://docs.pybossa.com/en/latest/api.html#update-announcement
         * @param {String|Number} announcementId
         *   The announcement ID.
         */
        getUpdateAnnouncement (announcementId) {
          return this.client.get(`/admin/announcement/${announcementId}/update`)
        },

        /**
         * Update an announcment.
         *
         * http://docs.pybossa.com/en/latest/api.html#update-announcement
         * @param {String|Number} announcementId
         *   The announcement ID.
         * @param {Object} form
         *   The form.
         */
        updateAnnouncement (announcementId, form) {
          return this.client.post(`/admin/announcement/${announcementId}/update`, {
            params: form
          })
        },

        /**
         * Get admin users.
         *
         * http://docs.pybossa.com/en/latest/api.html#id9
         */
        getAdminUsers () {
          return this.client.get(`/admin/users`)
        },

        /**
         * Search users.
         *
         * http://docs.pybossa.com/en/latest/api.html#id9
         * @param {Object} form
         *   The form.
         */
        searchUsers (form) {
          return this.client.post(`/admin/users`, {
            params: form
          })
        },

        /**
         * Add a user to admin.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-users-add
         */
        addAdminUser (userId) {
          return this.client.get(`/admin/users/add/${userId}`)
        },

        /**
         * Remove a user from admin.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-users-del
         */
        delAdminUser (userId) {
          return this.client.get(`/admin/users/del/${userId}`)
        },

        /**
         * Export users.
         * @param {String} format
         *   The output format (csv or json).
         */
        exportUsers (format) {
          return this.client.get(`/admin/users/export`, {
            responseType: 'arraybuffer',
            params: {
              format: format
            }
          })
        },

        /**
         * Get admin categories data.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-categories
         */
        getAdminCategories () {
          return this.client.get(`/admin/categories`)
        },

        /**
         * Add a category.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-categories
         * @param {Object} form
         *   The form.
         */
        addCategory (form) {
          return this.client.post(`/admin/categories`, { params: form })
        },

        /**
         * Get delete category data.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-categories-delete
         * @param {String|Number} categoryId
         *   The category ID.
         */
        getDeleteCategory (categoryId) {
          return this.client.get(`/admin/categories/del/${categoryId}`)
        },

        /**
         * Delete a category.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-categories-delete
         * @param {String|Number} categoryId
         *   The category ID.
         */
        deleteCategory (categoryId) {
          const endpoint = `/admin/categories/del/${categoryId}`
          return new Promise((resolve, reject) => {
            this.client.get(endpoint).then(r => {
              return this.client.post(endpoint, {
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
         * http://docs.pybossa.com/en/latest/api.html#admin-categories-update
         * @param {String|Number} categoryId
         *   The category ID.
         */
        getUpdateCategory (categoryId) {
          return this.client.get(`/admin/categories/update/${categoryId}`)
        },

        /**
         * Update a category.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-categories-update
         * @param {String|Number} categoryId
         *   The category ID.
         * @param {Object} form
         *   The form.
         */
        updateCategory (categoryId, form) {
          return this.client.post(`/admin/categories/update/${categoryId}`, {
            params: form
          })
        },

        /**
         * Get the admin dashboard.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-dashboard
         */
        getAdminDashboard () {
          return this.client.get(`/admin/dashboard`)
        },

        /**
         * Get the admin featured projects data.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-featured
         */
        getAdminFeatured () {
          return this.client.get(`/admin/featured`)
        },

        /**
         * Feature a project.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-un-feature-projects
         * @param {String|Number} projectId
         *   The category ID.
         * @param {Object} form
         *   The form.
         */
        featureProject (projectId, form) {
          return this.client.post(`/admin/featured/${projectId}`, {
            params: form
          })
        },

        /**
         * Unfeature a project.
         *
         * http://docs.pybossa.com/en/latest/api.html#admin-un-feature-projects
         * @param {String|Number} projectId
         *   The category ID.
         * @param {Object} form
         *   The form.
         */
        unfeatureProject (projectId, form) {
          return this.client.del(`/admin/featured/${projectId}`, {
            params: form
          })
        },

        /**
         * Get the API help.
         *
         * http://docs.pybossa.com/en/latest/api.html#help-api
         */
        getApiHelp () {
          return this.client.get(`/help/api`)
        },

        /**
         * Get the privacy policy.
         *
         * http://docs.pybossa.com/en/latest/api.html#help-privacy
         */
        getPrivacyHelp () {
          return this.client.get(`/help/privacy`)
        },

        /**
         * Get the cookies policy.
         *
         * http://docs.pybossa.com/en/latest/api.html#help-cookie-policy
         */
        getCookiesHelp () {
          return this.client.get(`/help/cookies-policy`)
        },

        /**
         * Get the terms of use.
         *
         * http://docs.pybossa.com/en/latest/api.html#help-terms-of-use
         */
        getTermsHelp () {
          return this.client.get(`/help/terms-of-use`)
        },

        /**
         * Get the server stats.
         *
         * http://docs.pybossa.com/en/latest/api.html#pybossa-server-stats
         */
        getStats () {
          return this.client.get(`stats/`)
        },

        /**
         * Get the server stats summary.
         */
        getStatsSummary () {
          return this.client.get(`/api/globalstats`)
        },

        /**
         * Get a category.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-category
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
          return this.client.get(endpoint)
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
            this.client.get(url, params).then(r => {
              // Additional filter needed as the search is not exact (i.e. if one
              // category name is a part of another both could be returned)
              r.data = {
                categories: this._filterMicrositeCategories(r.data, key)
              }
              resolve(r)
            })
          })
        },

        /**
         * Get project data.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-shortname
         * @param {String} shortname
         *   The project's short name.
         */
        getProject (shortname) {
          return this.client.get(`/project/${shortname}`)
        },

        /**
         * Get project stats data.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-settings
         * @param {String} shortname
         *   The project's short name.
         */
        getProjectStats (shortname) {
          return this.client.get(`/project/${shortname}/stats`)
        },

        /**
         * Get the new project data.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-creation
         */
        getNewProject () {
          return this.client.get(`/project/new`)
        },

        /**
         * Add a new project.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-creation
         * @param {Object} form
         *   The form.
         */
        newProject (form) {
          return this.client.post(`/project/new`, { params: form })
        },

        /**
         * Get the delete project data.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-delete
         * @param {String} shortname
         *   The project's short name.
         */
        getDeleteProject (shortname) {
          return this.client.get(`/project/${shortname}/delete`)
        },

        /**
         * Delete a project.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-delete
         * @param {String} shortname
         *   The project's short name.
         * @param {Object} form
         *   The form.
         */
        deleteProject (shortname, form) {
          return this.client.post(`/project/${shortname}/delete`, { params: form })
        },

        /**
         * Get the update project data.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-update
         * @param {String} shortname
         *   The project's short name.
         */
        getUpdateProject (shortname) {
          return this.client.get(`/project/${shortname}/update`)
        },

        /**
         * Update a project.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-update
         * @param {String} shortname
         *   The project's short name.
         * @param {Object} form
         *   The form.
         */
        updateProject (shortname, form) {
          return this.client.post(`/project/${shortname}/update`, { params: form })
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
          return this.client.get(`/project/${shortName}/tasks/export`, {
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
         * http://docs.pybossa.com/en/latest/api.html#project-tasks-browse
         * @param {String} shortname
         *   The project's short name.
         * @param {String|Number} page
         *   The page number.
         */
        getBrowseTasks (shortname, page) {
          return this.client.get(`/project/${shortname}/tasks/browse/${page}`)
        },

        /**
         * Get a task importer.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-tasks-import
         * @param {String} shortname
         *   The project's short name.
         * @param {String} type
         *   The importer type.
         */
        getTaskImporter (shortname, type) {
          return this.client.get(`/project/${shortname}/tasks/import`, {
            params: {
              type: type
            }
          })
        },

        /**
         * Import tasks.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-tasks-import
         * @param {String} shortname
         *   The project's short name.
         * @param {Object} form
         *   The form.
         */
        importTasks (shortname, form) {
          return this.client.post(`/project/${shortname}/tasks/import`, {
            params: form
          })
        },

        /**
         * Get the project tutorial.
         *
         * http://docs.pybossa.com/en/latest/api.html#project-tutorial
         * @param {String} shortname
         *   The project's short name.
         */
        getTutorial (shortname) {
          return this.client.get(`/project/${shortname}/tutorial`)
        }
      }
    }
    return this._instance
  }
}

// Interceptors
PyBossaApi.instance.client.interceptors.request.use(addCsrfHeader)
PyBossaApi.instance.client.interceptors.response.use(null, handleErrors)
PyBossaApi.instance.client.interceptors.response.use(handleFlash)

export default PyBossaApi.instance
