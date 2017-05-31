import config from '@/config'
import router from '@/router'
import getSiteKey from '@/router'

const axios = require('axios').create({
  timeout: 10000,
  withCredentials: true, // cookie
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  transformResponse: [function (data) {
    console.log(data);
    let json = {};

    try {
      json = JSON.parse(data);
    } catch (e) {
      json = {};
    }

    if ('flash' in json) {
      console.log(json.flash);
    }

    return json;
  }],
});

/**
 * Build URL according to current 
 */
function buildUrl(endpoint) {
  const key = getSiteKey()
  const host = config[key].host
}

// get
export const _get = (req) => {
  const url = buildUrl(req.endpoint)
  return axios.get(req.url, {params: req.data})
}

// put
export const _put = (req) => {
  const url = buildUrl(req.endpoint)
  return axios({ method: 'put', url: url, data: req.data })
}

// post
export const _post = (req) => {
  const url = buildUrl(req.endpoint)
  return axios({ method: 'post', url: `${host}/${req.url}`, data: req.data })
}

// delete
export const _delete = (req) => {
  const url = buildUrl(req.endpoint)
  return axios({ method: 'delete', url: `${host}/${req.url}`, data: req.data })
}