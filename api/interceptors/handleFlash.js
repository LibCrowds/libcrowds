import Vue from 'vue'
import capitalize from 'capitalize'

/**
 * Process flash messages.
 * @param {Object} res
 *   The response.
 */
export default function (res) {
  if (res !== undefined && res.data.status !== 'error' && 'flash' in res.data) {
    Vue.Notification({
      title: capitalize(r.data.status),
      text: r.data.flash,
      type: r.data.status
    })
  }
  return res
}
