import config from '@/config'
import store from '@/store'

const axios = require('axios').create({
  timeout: 10000,
  withCredentials: true, // cookie
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  transformResponse: [function (data) {
    console.log(data)
    let json = {}

    try {
      json = JSON.parse(data)
    } catch (e) {
      json = {}
    }

    if ('flash' in json) {
      console.log(json.flash)
    }

    return json
  }]
})

/**
 * Perform a request.
 */
export default function (method, req) {
  const sitename = store.state.route.params.sitename
  const baseURL = config[ sitename ].host
  return axios({
    baseURL: baseURL,
    method: method,
    url: req.endpoint,
    data: req.data
  })
}
