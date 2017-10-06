import router from '@/router'

export default function (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    router.push({ name: error.response.status })
  } else if (error.request) {
    // The request was made but no response was received
    router.push({ name: 598 })
  } else {
    // Something happened in setting up the request that triggered an Error
    router.push({ name: 500 })
  }
  return Promise.reject(error)
}
