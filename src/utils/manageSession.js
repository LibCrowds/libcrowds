import throttle from 'lodash/throttle'

/**
 * Check for a PyBossa session cookie for the current user, update accordingly.
 * @param {Object} store
 *   The vuex store.
 * @param {String} cookie
 *   The document cookie string.
 */
export default throttle((store, cookie) => {
  const currentUser = store.state.currentUser
  const allCookies = cookie.split(';')
  let hasSession = false
  let sessionName = null

  for (let cookie of allCookies) {
    if (cookie.indexOf('remember_token=') > -1) {
      hasSession = true
      sessionName = cookie.split('|')[0].split('=')[1]
    }
  }

  const update = (
    ((currentUser === null || currentUser === undefined) === hasSession) ||
    (hasSession && currentUser.name !== sessionName)
  )

  if (update) {
    store.dispatch('UPDATE_CURRENT_USER')
  }
}, 200)
