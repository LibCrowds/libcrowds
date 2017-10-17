import capitalize from 'capitalize'

/**
 * Process flash messages.
 * @param {Object} res
 *   The response.
 * @param {Object} app
 *   The Vue instance.
 */
export default function (res, app) {
  if (res !== undefined && res.data.status !== 'error' && 'flash' in res.data) {
    app.$notify({
      title: capitalize(res.data.status),
      text: res.data.flash,
      type: res.data.status
    })
  }
  return res
}
