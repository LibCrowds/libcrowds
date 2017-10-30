import isEmpty from 'lodash/isEmpty'

/**
 * Router middleware to check for unread announcements.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ store, app }) {
  const currentUser = store.state.currentUser
  if (isEmpty(currentUser)) {
    return
  }
  store.dispatch('UPDATE_LAST_ANNOUNCEMENT', app.$axios)
}
