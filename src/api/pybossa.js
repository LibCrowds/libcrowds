import axios from 'axios'

class PyBossaApi {
  constructor (host) {
    this.client = axios.create({
      baseURL: host,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000,
      data: {}  // Must always be set otherwise Content-Type gets deleted
    })
  }

  /**
   * Perform a GET request.
   * @param {*} url
   *   The URL.
   * @param {*} params
   *   The query parameters.
   */
  get (url, params) {
    return new Promise((resolve, reject) => {
      this.client.get(url, params).then(r => {
        resolve(r.data)
      }).catch(err => {
        reject(err)
      })
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
    return this.get(url, params)
  }
}

export default PyBossaApi
