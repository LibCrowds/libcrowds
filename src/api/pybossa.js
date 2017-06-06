import axios from 'axios'

/**
 * Return a configured axios instance.
 */
export default function (siteConfig) {
  return axios.create({
    baseUrl: siteConfig.host,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  })
}
