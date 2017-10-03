import merge from 'lodash/merge'
import siteConfig from '@/siteConfig'
import axios from 'axios'

class PyBossaApi {
  constructor () {
    this.client = axios.create({
      baseURL: siteConfig.pybossaHost,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000,
      data: {}  // Must always be set otherwise Content-Type gets deleted
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
   * Get data from multiple PYBOSSA endpoints
   *
   * Subsequent sources overwrite property assignments of previous sources.
   * @param {Array} endpoints
   *   The endpoints.
   *
   */
  getData (endpoints) {
    let promises = []
    for (let endpoint of endpoints) {
      promises.push(this.client.get(endpoint))
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(values => {
        resolve(values.reduce((a, b) => {
          return merge(a, b)
        }, {}))
      })
    })
  }

  /**
   * Get a user's profile.
   *
   * If name is not given then a requests is sent to retrieve the current
   * user's profile
   * @param {String} [name='profile']
   *   The current user's name.
   */
  getProfile (name='profile') {
    return this.client.get(`/account/${name}`)
  }

  /**
   * Signout the current user.
   */
  signout () {
    return this.client.get('/account/signout')
  }

  /**
   * Get the leaderboard.
   * @param {String} [window=0]
   *   The current user's name.
   */
  getLeaderboard (window) {
    return this.client.get(`/leaderboard/window/${window}`)
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
}

export default new PyBossaApi()
