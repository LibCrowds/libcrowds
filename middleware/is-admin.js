import isEmpty from 'lodash/isEmpty'

/**
 * Middleware to check if the current user is admin.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ app, store, route, redirect, error }) {
  const currentUser = store.state.currentUser
  if (isEmpty(currentUser)) {
    redirect(`/account/signin?next=${route.path}`)
  } else if (!currentUser.admin) {
    error({
      message: 'Forbidden',
      statusCode: 403
    })
  }
}
