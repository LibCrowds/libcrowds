import axios from 'axios'

/**
 * Return a configured axios instance.
 */
export const create = (siteConfig) => {
  let instance = axios.create({
    baseURL: siteConfig.host,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {}  // Must always be set otherwise Content-Type gets deleted
  })

  instance.interceptors.response.use((res) => {
    if ('next' in res.data) {
      return instance.get(res.data.next)
    }
    return res
  }, function (error) {
    
    // TODO: handle response errors
    return Promise.reject(error)
  })

  return instance
}
