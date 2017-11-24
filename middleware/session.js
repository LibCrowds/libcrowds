import { updateSession } from '@/utils/auth'

/**
 * Router middleware to manage the user's session.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ isClient, store, app }) {
  const currentUser = store.state.currentUser
  if (isClient && updateSession(currentUser, document.cookie)) {
    store.dispatch('UPDATE_CURRENT_USER', app.$axios, app.$ga)
  }
}
