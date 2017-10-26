import isEmpty from 'lodash/isEmpty'

/**
 * Router middleware to check for unread announcements.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ isServer, store, app }) {
  const currentUser = store.state.currentUser
  if (isEmpty(currentUser) || isServer) {
    return
  }

  return app.$axios.get('/api/announcement', {
    params: {
      orderby: 'created',
      desc: true,
      limit: 1
    }
  }).then(data => {
    if (data.length) {
      store.dispatch('UPDATE_LAST_ANNOUNCEMENT', data[0])
    }
  })
}
