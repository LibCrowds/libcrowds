import isEmpty from 'lodash/isEmpty'

/**
 * Middleware to check if the current user is admin or the owner of a page.
 * @param {Object} context
 *   The nuxt context.
 */
export default function ({ store, route, redirect, error }) {
  const name = route.params.name
  const currentUser = store.state.currentUser
  if (isEmpty(currentUser)) {
    redirect(`/account/signin?next=${route.path}`)
  } else if (!currentUser.admin && !currentUser.name === name) {
    error({
      message: 'Sorry, access to this page is restricted.',
      statusCode: 403
    })
  }
}
