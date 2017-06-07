import axios from 'axios'
import config from '@/config'

const instance = axios.create({
  baseURL: config.pybossaHost,
  headers: {
    'Content-Type': 'application/json'
  },
  data: {}  // Must always be set otherwise Content-Type gets deleted
})

// TODO: Handle next params
instance.interceptors.response.use((res) => {
  if ('next' in res.data) {
    console.log('next parameter in response')
  }
  return res
}, function (error) {
  // TODO: Log these errors and notify the user
  console.error(error.response)
  return Promise.reject(error)
})

export default instance
