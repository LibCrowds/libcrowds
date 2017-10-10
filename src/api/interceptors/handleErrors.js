import router from '@/router'

/**
 * Handle different types of error.
 * @param {Object} error
 *   The error
 */
export default function (error) {
  if (error.response) {
    // Non-2xx status code
    router.push({ name: error.response.status })
  } else if (error.request) {
    // No response
    router.push({ name: 598 })
  } else {
    // Error setting up the request
    router.push({ name: 500 })
  }
  return Promise.reject(error)
}
