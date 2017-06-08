import axios from 'axios'
import config from '@/config'
import router from '@/router'
import store from '@/store'

const instance = axios.create({
  baseURL: config.pybossaHost,
  headers: {
    'Content-Type': 'application/json'
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  data: {}  // Must always be set otherwise Content-Type gets deleted
})

instance.interceptors.request.use(function (config) {
  console.log(config)
  return config
}, function (error) {
  return Promise.reject(error)
})

instance.interceptors.response.use((r) => {
  console.log(document.cookie)
  console.log(r)
  if (r.data.template === 'account/signin.html') {
    router.push({
      name: 'signin',
      params: {
        next: store.state.route.path
      }
    })
  }
  if ('next' in r.data) {  // TODO: Handle next params
    console.log('next parameter in response')
  }
  return r
}, function (error) {  // TODO: Log these errors and notify the user
  console.error(error.response)
  return Promise.reject(error)
})

export default instance
