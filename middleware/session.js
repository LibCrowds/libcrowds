import { updateSession } from '@/utils/auth'

/**
 * Router middleware to manage the user's session.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ isClient, store, req, app }) {
  const currentUser = store.state.currentUser
  let update = false

  if (isClient) {
    update = updateSession(currentUser, document.cookie)
  } else if (req && 'cookie' in req.headers) {
    update = updateSession(currentUser, req.headers.cookie)
  }

  if (update && app.hasOwnProperty('$axios')) {
    store.dispatch('UPDATE_CURRENT_USER', app.$axios, app.$ga)
  }
}
