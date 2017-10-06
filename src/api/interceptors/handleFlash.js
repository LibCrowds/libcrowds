import store from '@/store'

/**
 * Process flash messages.
 * @param {Object} r
 *   The response.
 */
export default function (r) {
  if (r === undefined) {
    return
  }

  if (r.data.status !== 'error' && 'flash' in r.data) {
    store.dispatch('NOTIFY', {
      msg: r.data.flash,
      type: r.data.status
    })
  }
  return r
}
