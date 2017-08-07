import axios from 'axios'
import store from '@/store'
import router from '@/router'
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

  if (r === undefined) {
    return
  }

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
  if (error.response.status === 404) {
    router.push({ name: '404' })
  }
  const notification = { msg: error.message, type: 'error' }
  store.dispatch('NOTIFY', notification)
  return Promise.reject(error)
})

// Handle success flash messages
instance.interceptors.response.use((r) => {
  if (r === undefined) {
    return
  }

  if (r.data.status === 'success' && 'flash' in r.data) {
    store.dispatch('NOTIFY', {
      msg: r.data.flash,
      type: 'success'
    })
  }
  return r
})

export default instance
