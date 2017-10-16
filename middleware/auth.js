import axios from 'axios'
import { manageSession } from '@/utils/auth'

/**
 * Router middleware to manage the user's session.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ isServer, store, req, app }) {
  if (isServer && req) {
    axios.defaults.headers.common.cookie = req.headers.cookie
    manageSession(store, req.headers.cookie, app)
  } else {
    manageSession(store, document.cookie, app)
  }
}
