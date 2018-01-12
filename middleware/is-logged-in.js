import isEmpty from 'lodash/isEmpty'

/**
 * Middleware to check if the user is logged in.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ store, route, redirect }) {
  const currentUser = store.state.currentUser
  if (isEmpty(currentUser)) {
    redirect(`/account/signin?next=${route.path}`)
  }
}
