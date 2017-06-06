import axios from 'axios'

/**
 * Return a configured axios instance.
 */
export const create = (siteConfig) => {
  return axios.create({
    baseURL: siteConfig.host,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {}  // Must always be set otherwise Content-Type gets deleted
  })
}
