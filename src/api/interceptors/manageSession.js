/**
 * Check for a PyBossa session cookie for the current user, update accordingly.
 * @param {Object} store
 *   The vuex store.
 * @param {Object} cookie
 *   The document cookie.
 */
export default function (store, cookie) {
  const currentUser = store.state.currentUser
  const hasSession = cookie.indexOf('remember_token=') > -1
  let sessionName = null
  if (hasSession) {
    sessionName = cookie.split('|')[0].split('=')[1]
  }

  const update = (
    ((currentUser === null || currentUser === undefined) === hasSession) ||
    (hasSession && currentUser.name !== sessionName)
  )

  if (update) {
    store.dispatch('UPDATE_CURRENT_USER')
  }
}
