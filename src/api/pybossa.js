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
    this.uninterceptedClient = axios.create(opts)

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

export default PyBossaApi
