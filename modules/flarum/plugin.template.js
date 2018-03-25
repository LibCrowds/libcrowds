import JSCookie from 'js-cookie'
import axios from 'axios'
import crypto from 'crypto'

class Flarum {
  constructor (options) {
    this.remember_me_key = 'flarum_remember'
    this.url = options.url
    this.apiKey = options.apiKey
    this.salt = options.salt
  }

  /**
   * Sign a user in.
   * @param {String} username
   *   The user's name.
   * @param {String} email
   *   The user's email address.
   */
  signin (username, email) {
    const password = this.createPassword(username)

    return new Promise((resolve, reject) => {
      return this.getUser(username).then(() => {
        // User exists, so get a token
        return this.getToken(username, password)
      }).catch(err => {
        if (err.statusCode === 404) {
          // User doesn't exist, so sign up then get a token
          return this.signup(username, password, email).then(data => {
            return this.getToken(username, password)
          })
        } else {
          reject(err)
        }
      }).then(token => {
        JSCookie.set(this.remember_me_key, token)
        resolve()
      })
    })
  }

  /**
   * Sign a user up.
   * @param {String} username
   *   The user's name.
   * @param {String} password
   *   The user's password.
   * @param {String} email
   *   The user's email address.
   */
  signup (username, password, email) {
    const data = {
      type: 'users',
      attributes: {
        username: username,
        password: password,
        email: email
      }
    }

    return this.request('/api/users', 'POST', data)
  }

  /**
   * Sign the current user out.
   */
  signout () {
    JSCookie.remove(this.remember_me_key)
  }

  /**
   * Create an encrypted password.
   * @param {String} username
   *   The user's name.
   */
  createPassword (username) {
    const hash = crypto.createHmac('sha256', this.salt)
      .update(username)
      .digest('hex')
    return hash
  }

  /**
   * Get a user by name.
   * @param {String} username
   *   The user's name.
   */
  getUser (username) {
    const endpoint = '/api/users/' + username
    return this.request(endpoint, 'GET')
  }

  /**
   * Update a user by name.
   * @param {String} username
   *   The user's name.
   * @param {Object} data
   *   The data to update.
   */
  updateUser (username, data) {
    const endpoint = '/api/users/' + username
    return this.request(endpoint, 'PATCH', data)
  }

  /**
   * Get token for an authenticated user.
   * @param {String} username
   *   The user's name.
   * @param {String} password
   *   The user's password.
   */
  getToken (username, password) {
    const year = 365 * 24 * 60 * 60
    const data = {
      identification: username,
      password: password,
      lifetime: year
    }

    return new Promise((resolve, reject) => {
      this.request('/api/token', 'POST', data).then(response => {
        resolve(response['token'])
      }).catch(err => {
        if (err.statusCode === 401) {
          // If permission is denied it probably means the user set their
          // password before this module was enabled, so let's update it.
          return this.updateUser(username, { password: password })
        } else {
          reject(err)
        }
      }).then(response => {
        // Attempt to get the token again, following the user update
        return this.request('/api/token', 'POST', data)
      }).then(response => {
        resolve(response['token'])
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Send a request to Flarum.
   * @param {String} endpoint
   *   The Flarum endpoint.
   * @param {Object} data
   *   The data.
   */
  request (endpoint, method, data = {}) {
    return axios({
      baseURL: this.url,
      url: endpoint,
      method: method,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.apiKey + '; userId=1'
      },
      withCredentials: true
    })
  }
}

export default (ctx, inject) => {
  const options = {
    url: '<%= options.url %>',
    apiKey: '<%= options.apiKey %>',
    salt: '<%= options.salt %>'
  }

  // Create a new Flarum instance
  const flarum = new Flarum(options)

  // Inject as $flarum
  ctx.$flarum = flarum
  inject('flarum', flarum)
}
