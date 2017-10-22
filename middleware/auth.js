import axios from 'axios'
import { updateSession } from '@/utils/auth'

/**
 * Router middleware to manage the user's session.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ isServer, store, req, app }) {
  const currentUser = store.state.currentUser
  let update = false

  if (isServer && req) {
    axios.defaults.headers.common.cookie = req.headers.cookie
    update = updateSession(currentUser, req.headers.cookie)
  } else {
    update = updateSession(currentUser, document.cookie)
  }

  if (update && app.hasOwnProperty('$axios')) {
    store.dispatch('UPDATE_CURRENT_USER', app.$axios)
  }
}
