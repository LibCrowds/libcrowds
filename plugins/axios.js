export default function ({ $axios, error }) {
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
    err.code = parseInt(err.response && err.response.status) || 500
    err.message = (
      err.message ||
      err.response.statusText ||
      'Internal Server Error'
    )
    console.log(err)
    return error(err)
  })
}
