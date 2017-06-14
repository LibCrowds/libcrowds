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

// Handle errors
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

// Handle flash messages
instance.interceptors.response.use((r) => {
  if ('flash' in r.data) {
    const notification = { msg: r.data.flash, type: r.data.status }
    store.commit('SET_NOTIFICATION', notification)
  }
  return r
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
