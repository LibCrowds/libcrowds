import { updateSession } from '@/utils/auth'

/**
 * Router middleware to manage the user's session.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ store, app }) {
  const currentUser = store.state.currentUser
  if (process.client && updateSession(currentUser, document.cookie)) {
    store.dispatch('UPDATE_CURRENT_USER', app.$axios, app.$ga)
  }
}
