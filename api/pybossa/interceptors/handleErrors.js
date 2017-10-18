/**
 * Handle different types of error.
 * @param {Object} error
 *   The error
 */
export default function (error) {
  if (error.response) {
    // Non-2xx status code
    error.statusCode = (
      error.statusCode ||
      parseInt(error.response.status) ||
      500
    )
    error.message = (
      error.message ||
      error.response.statusText ||
      (error.statusCode + ' (Internal Server Error)')
    )
  } else if (error.request) {
    // No response
    error.statusCode = error.statusCode || 598
    error.message = error.message || 'Network Error'
  } else {
    // Error setting up the request
    error.statusCode = error.statusCode || 500
    error.message = error.message || 'Axios Error'
  }
  console.log(error)
  return Promise.reject(error)
}
