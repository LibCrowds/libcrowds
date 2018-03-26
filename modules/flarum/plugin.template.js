import JSCookie from 'js-cookie'
import axios from 'axios'
import crypto from 'crypto'

class Flarum {
  constructor (options) {
    this.rememberMeKey = 'flarum_remember'
    this.salt = options.salt
    this.url = options.url
    this.apiKey = options.apiKey
    this.debug = options.debug
    this.secure = options.secure
    this.sessionCookieDomain = options.sessionCookieDomain
    this.client = this.createAxiosClient()
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
      return this.getUserByEmail(email).then(user => {
        if (!user) {
          // Sign up if existing user not found
          return this.signup(username, email)
        } else {
          return user
        }
      }).then(user => {
        // Ensure that the username and password are consistent
        this.updateUser(user.id, { password: password, username: username })
      }).then(user => {
        return this.getToken(username, password)
      }).then(token => {
        this.setCookie(token)
        resolve()
      }).catch(err => {
        reject(err)
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
      data: {
        type: 'users',
        attributes: {
          username: username,
          password: password,
          email: email
        }
      }
    }

    return new Promise((resolve, reject) => {
      return this.request('/api/users', 'POST', data).then(response => {
        resolve(response.data.data)
      }).catch(err => {
        reject(err)
      })
    })
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
   * Get a user by email address.
   * @param {String} email
   *   The user's email.
   */
  getUserByEmail (email) {
    return new Promise((resolve, reject) => {
      this.request('/api/users', 'GET', {}, {
        'filter[q]': 'email:"' + email + '"'
      }).then(response => {
        if (response.data.data.length) {
          resolve(response.data.data[0])
        } else {
          resolve(null)
        }
      }).catch(err => {
        reject(err)
      })
    })
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
    return new Promise((resolve, reject) => {
      return this.request(endpoint, 'PATCH', {
        data: {
          type: 'users',
          id: userId,
          attributes: attributes
        }
      }).then(response => {
        resolve(response.data.data)
      }).catch(err => {
        reject(err)
      })
    })
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
    const authData = {
      identification: username,
      password: password,
      lifetime: year
    }

    return new Promise((resolve, reject) => {
      this.request('/api/token', 'POST', authData).then(response => {
        resolve(response.data['token'])
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
      domain: this.sessionCookieDomain,
      expires: 365,
      secure: this.secure
    })

    if (this.debug) {
      console.log('Cookies updated:', document.cookie)
    }
  }

  /**
   * Send a request to Flarum.
   * @param {String} endpoint
   *   The Flarum endpoint.
   * @param {Object} data
   *   Data for PUT, POST or PATCH requests.
   * @param {Object} params
   *   URL parameters.
   */
  request (endpoint, method, data = {}, params = {}) {
    return this.client({
      url: endpoint,
      method: method,
      data: data,
      params: params
    })
  }

  /**
   * Return a configured axios instance.
   */
  createAxiosClient () {
    const instance = axios.create({
      baseURL: this.url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + this.apiKey + '; userId=1'
      },
      withCredentials: true
    })

    // Enable response debugger
    if (this.debug) {
      instance.interceptors.response.use(resp => {
        console.log('Response:', resp)
        return resp
      })
    }

    return instance
  }
}

export default (ctx, inject) => {
  const options = {
    url: '<%= options.url %>',
    apiKey: '<%= options.apiKey %>',
    sessionCookieDomain: '<%= options.sessionCookieDomain %>',
    salt: '<%= options.salt %>',
    debug: '<%= options.debug %>',
    secure: '<%= options.secure %>'
  }

  // Create a new Flarum instance
  const flarum = new Flarum(options)

  // Inject as $flarum
  ctx.$flarum = flarum
  inject('flarum', flarum)
}
