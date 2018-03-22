export default function ({ $axios, error, req }) {
  $axios.onRequest(config => {
    config.headers['Content-Type'] = 'application/json'

    // Use any form data to set CSRF token header
    if (config.data && config.data.hasOwnProperty('csrf')) {
      config.headers['X-CSRFToken'] = config.data.csrf
    }

    // Ensure some data otherwise axois can delete Content-Type
    if (config.data === undefined) {
      config.data = {}
    }
    return config
  })

  $axios.onError(err => {
    const errorParams = {
      statusCode: parseInt(err.response && err.response.status) || 500,
      message: (
        err.message ||
        err.response.statusText ||
        'Internal Server Error'
      )
    }
    return Promise.reject(errorParams)
  })
}
