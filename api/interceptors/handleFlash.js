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
      title: capitalize(res.data.status),
      text: res.data.flash,
      type: res.data.status
    })
  }
  return res
}
