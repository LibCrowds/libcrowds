import axios from 'axios'
import store from '@/store'
import config from '@/config'
import manageSession from '@/utils/manageSession'

const instance = axios.create({
  baseURL: config.pybossaHost,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000,
  data: {}  // Must always be set otherwise Content-Type gets deleted
})

// Handle user session
instance.interceptors.response.use((r) => {
  let dontCheck = [
    '/api'
  ]

  for (let endpoint of dontCheck) {
    if (r.request.responseURL.startsWith(`${config.pybossaHost}${endpoint}`)) {
      return r
    }
  }

  manageSession(store, document.cookie)
  return r
})

// Handle errors
instance.interceptors.response.use(undefined, (error) => {
  const notification = { msg: error.message, type: 'error' }
  store.dispatch('NOTIFY', notification)
})

export default instance
