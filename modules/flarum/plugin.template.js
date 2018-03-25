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
    console.log('signin to flarum')
    const password = this.createPassword(username)

    return this.getToken(password).then(token => {
      if (!token) {
        return this.signup(username, password, email).then(data => {
          return this.getToken(password)
        })
      }
    }).then(token => {
      console.log(token)
      JSCookie.set(this.remember_me_key, token)
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
    console.log('signup to flarum')
    const data = {
      type: 'users',
      attributes: {
        username: username,
        password: password,
        email: email
      }
    }

    return this.post('/api/users', data)
  }

  /**
   * Sign the current user out.
   */
  signout () {
    console.log('signing out from flarum')
    JSCookie.remove(this.remember_me_key)
  }

  /**
   * Create an encrypted password.
   * @param {String} username
   *   The user's name.
   */
  createPassword (username) {
    const hash = crypto.createHmac('sha256', this.salt)
    hash.update(username)
    return hash.digest('hex')
  }

  /**
   * Get Flarum token for a signed in user.
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
      this.post('/api/token', data).then(response => {
        resolve(response.hasOwnProperty('token') ? response['token'] : '')
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * Send a POST request to Flarum.
   * @param {String} endpoint
   *   The Flarum endpoint.
   * @param {Object} data
   *   The data.
   */
  post (endpoint, data) {
    return axios({
      baseURL: this.url,
      url: endpoint,
      method: 'POST',
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.apiKey}; userId=1`
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
