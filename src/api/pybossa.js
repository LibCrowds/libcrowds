import axios from 'axios'
import config from '@/config'
import router from '@/router'
import store from '@/store'

const instance = axios.create({
  baseURL: config.pybossaHost,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  data: {}  // Must always be set otherwise Content-Type gets deleted
})

// Default error handler
instance.interceptors.response.use(undefined, (error) => {
  const notification = { msg: error, type: 'error' }
  store.commit('SET_NOTIFICATION', notification)
})

// Forward unauthenticated users to signin page
instance.interceptors.response.use((r) => {
  if (r.data.template === 'account/signin.html') {
    router.push({
      name: 'signin',
      params: {
        next: store.state.route.path
      }
    })
  }
  return r
}, function (error) {
  console.error(error.response)
  return Promise.reject(error)
})

instance.interceptors.response.use((r) => {
  if (r.data.template === 'account/signin.html') {
    router.push({
      name: 'signin',
      params: {
        next: store.state.route.path
      }
    })
  }
  return r
}, function (error) {
  console.error(error.response)
  return Promise.reject(error)
})

// TODO: Handle next params
instance.interceptors.response.use((r) => {
  if ('next' in r.data) {
    console.log('next parameter in response')
  }
  return r
}, function (error) {  // TODO: Log these errors and notify the user
  console.error(error.response)
  return Promise.reject(error)
})

export default instance
