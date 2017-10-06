import merge from 'lodash/merge'
import axios from 'axios'

class PyBossaApi {
  constructor (host) {
    const opts = {
      baseURL: host,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000,
      data: {}  // Must always be set otherwise Content-Type gets deleted
    }
    this.client = axios.create(opts)
    this.client.interceptors.response.use(undefined, error => {
      Promise.reject(error)
    })
  }

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
  }

  /**
   * Get the current user's favourites.
   *
   * http://docs.pybossa.com/en/latest/api.html#favorites
   */
  getFavourites () {
    return this.client.get('/api/favourites')
  }

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
  }

  /**
   * Delete a favourite.
   *
   * http://docs.pybossa.com/en/latest/api.html#favorites
   * @param {String|Number} taskId
   *   The task ID.
   */
  deleteFavourite (taskId) {
    return this.client.del(`/api/favourites/${taskId}`)
  }

  /**
   * Get a list of accounts for the given page.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-index
   * @param {String|Number} page
   *   The page.
   */
  getAccountIndex(page=1) {
    return this.client.get(`/account/page/${page}`)
  }

  /**
   * Get the account registration data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-registration
   */
  getAccountRegistration() {
    return this.client.get('/account/register')
  }

  /**
   * Post the account registration data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-registration
   * @param {Object} form
   *   The form.
   */
  register(form) {
    return this.client.post('/account/register', {
      params: form
    })
  }

  /**
   * Get the account signin data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-sign-in
   */
  getAccountSignin() {
    return this.client.get('/account/signin')
  }

  /**
   * Post the account signin data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-sign-in
   * @param {Object} form
   *   The form.
   */
  signin(form) {
    return this.client.post('/account/signin', {
      params: form
    })
  }

  /**
   * Sign out.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-sign-out
   */
  signout() {
    return this.client.get('/account/signout')
  }

  /**
   * Get the recover password data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-recover-password
   */
  getRecoverPassword() {
    return this.client.get('/account/forgot-password')
  }

  /**
   * Post the recover password data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-recover-password
   * @param {Object} form
   *   The form.
   */
  recoverPassword(form) {
    return this.client.post('/account/forgot-password', {
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
  getAccount(name) {
    return this.client.get(`/account/${name}`)
  }

  /**
   * Get the profile of the current user.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-profile
   */
  getProfile() {
    return this.getAccount('profile')
  }

  /**
   * Get the projects belonging to the current user.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-projects
   * @param {String} name
   *   The username.
   */
  getAccountProjects(name) {
    return this.client.get(`/account/${name}/projects`)
  }

  /**
   * Get the update profile data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-update-profile
   * @param {String} name
   *   The username.
   */
  getUpdateProfile(name) {
    return this.client.get(`/account/${name}/update`)
  }

  /**
   * Post the update profile data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-update-profile
   * @param {String} name
   *   The username.
   * @param {Object} form
   *   The form.
    * @param {Object} type
   *   The additional form type (Upload, Password, or External).
   */
  updateProfile(name, form, type=null) {
    form.btn = type
    return this.client.post(`/account/${name}/update`, {
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
  getResetPassword(params) {
    return this.client.get('/account/reset-password', {
      params: params
    })
  }

  /**
   * Post the reset password data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-reset-password
   * @param {Object} form
   *   The form.
   */
  resetPassword(form) {
    return this.client.post('/account/reset-password', {
      params: form
    })
  }

  /**
   * Get the reset API key data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-reset-api-key
   */
  getResetApiKey () {
    return this.client.get(`/account/${name}/resetapikey`)
  }

  /**
   * Post the reset API key data.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-reset-api-key
   * @param {Object} form
   *   The form.
   */
  resetApiKey (form) {
    return this.client.post(`/account/${name}/resetapikey`, {
      params: form
    })
  }

  /**
   * Subscribe to the newsletter.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-subscribe-to-newsletter
   */
  subscribeToNewsletter () {
    return this.client.get(`/account/newsletter`, {
      params: {
        subscribe: true
      }
    })
  }

  /**
   * Confirm an email address.
   *
   * http://docs.pybossa.com/en/latest/api.html#account-confirm-email
   * @param {String} params
   *   The query params given in the confirm link.
   */
  confirmEmail(params) {
    return this.client.get('/account/confirm-email', {
      params: params
    })
  }




  /**
   * Return the categories for a microsite.
   *
   * This function assumes a limit of 100 categories per microsite.
   * @param {String} key
   *   The microsite key.
   */
  getMicrositeCategories (key) {
    const url = `/api/${key}`
    const params = {
      info: `collection::${key}`,
      fulltextsearch: 1
    }
    return new Promise((resolve, reject) => {
      this.client.get(url, params).then(data => {
        // Additional filter needed as the search is not exact (i.e. if one
        // category name is a part of another both could be returned)
        const filtered = this._filterMicrositeCategories(data, key)
        resolve(filtered)
      })
    })
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
  exportData (shortName, type, format) {
    return this.client.get(`/project/${shortName}/tasks/export`, {
      responseType: 'arraybuffer',
      params: {
        type: type,
        format: format
      }
    })
  }

  /**
   * Get the main leaderboard.
   * @param {String|Number} window
   *   Number of users above and below the current user to show.
   */
  getLeaderboard (window=0) {
    return this.client.get(`leaderboard/window/${window}`)
  }
}

export default PyBossaApi
