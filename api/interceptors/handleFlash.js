/**
 * Process flash messages.
 * @param {Object} r
 *   The response.
 */
export default function (res) {
  if (res !== undefined && res.data.status !== 'error' && 'flash' in res.data) {
    // store.dispatch('NOTIFY', {
    //   msg: r.data.flash,
    //   type: r.data.status
    // })
  }
  return res
}
