const axios = require('axios').create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  transformResponse: [function (data) {
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
export const request = (method, host, endpoint, data) => {
  return axios({
    method: method,
    baseURL: host,
    url: endpoint,
    data: data
  })
}
