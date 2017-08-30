import axios from 'axios'
import store from '@/store'
import router from '@/router'
import siteConfig from '@/siteConfig'

const instance = axios.create({
  baseURL: siteConfig.pybossaHost,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  data: {}  // Must always be set otherwise Content-Type gets deleted
})

// Handle errors
instance.interceptors.response.use(undefined, (error) => {
  const errorCodes = [401, 402, 403, 404]
  if (error.response !== undefined && error.response.status in errorCodes) {
    router.push({ name: error.response.status })
  }
  router.push({ name: 500 })
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

// Handle redirects
instance.interceptors.response.use((r) => {
  if (r !== undefined && 'next' in r.data && r.title !== 'Sign in') {
    router.push({ path: r.data.next })
  }
  return r
})

export default instance
