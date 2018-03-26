import JSCookie from 'js-cookie'
import axios from 'axios'
import crypto from 'crypto'
import url from 'url'

class Flarum {
  constructor (options) {
    this.rememberMeKey = 'flarum_remember'
    this.salt = options.salt
    this.url = options.url
    this.client = this.createAxiosClient(options.url, options.apiKey)
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
      return this.getUser(username).then(userResponse => {
        // User exists, so get a token
        return this.getToken(username, userResponse.data.data.id, password)
      }).catch(err => {
        if (err.status === 404) {
          // User doesn't exist, so sign up then get a token
          return this.signup(username, email).then(userResponse => {
            return this.getToken(username, userResponse.data.data.id, password)
          })
        } else {
          reject(err)
        }
      }).then(tokenResponse => {
        this.setCookie(tokenResponse.data['token'])
        resolve()
      })
    })
  }

  /**
   * Sign a user up.
   * @param {String} username
   *   The user's name.
   * @param {String} email
   *   The user's email address.
   */
  signup (username, email) {
    const password = this.createPassword(username)

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
   * @param {String} userId
   *   The user's ID.
   * @param {Object} attributes
   *   The attributes to update.
   */
  updateUser (userId, attributes) {
    const endpoint = '/api/users/' + userId
    return this.request(endpoint, 'PATCH', {
      data: {
        type: 'users',
        id: userId,
        attributes: attributes
      }
    })
  }

  /**
   * Get token for an authenticated user.
   * @param {String} username
   *   The user's name.
   * @param {String} userId
   *   The user's ID.
   * @param {String} password
   *   The user's password.
   */
  getToken (username, userId, password) {
    const year = 365 * 24 * 60 * 60
    const authData = {
      identification: username,
      password: password,
      lifetime: year
    }

    return new Promise((resolve, reject) => {
      this.request('/api/token', 'POST', authData).then(response => {
        resolve(response)
      }).catch(err => {
        if (err.response.status === 401) {
          // If permission is denied it probably means the user set their
          // password before this module was enabled, so let's update it.
          return this.updateUser(userId, { password: password })
        } else {
          reject(err)
        }
      }).then(response => {
        // Attempt to get the token again, following the user update
        return this.request('/api/token', 'POST', authData)
      }).then(response => {
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Set the Flarum user auth cookie.
   * @param {String} token
   *   The Flarum token.
   */
  setCookie (token) {
    JSCookie.set(this.rememberMeKey, token, {
      domain: url.parse(this.url).host,
      expires: 365
    })

    <% if (options.debug) { %>
    console.log('Cookie set for', url.parse(this.url).host)
    <% } %>
  }

  /**
   * Send a request to Flarum.
   * @param {String} endpoint
   *   The Flarum endpoint.
   * @param {Object} data
   *   The data.
   */
  request (endpoint, method, data = {}) {
    return this.client({
      url: endpoint,
      method: method,
      data: data
    })
  }

  /**
   * Return a configured axios instance.
   * @param {String} baseURL
   *   The base Flarum URL.
   * @param {String} apiKey
   *   The Flarum API key.
   */
  createAxiosClient (baseURL, apiKey) {
    const instance = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + apiKey + '; userId=1'
      },
      withCredentials: true
    })

    // Enable response debugger
    <% if (options.debug) { %>
      instance.interceptors.response.use(resp => {
        console.log('Response:', resp)
        return resp
      })
    <% } %>

    return instance
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
