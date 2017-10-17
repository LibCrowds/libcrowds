import capitalize from 'capitalize'

/**
 * Process flash messages.
 * @param {Object} res
 *   The response.
 * @param {Object} ctx
 *   The Nuxt context.
 */
export default function (res, ctx) {
  if (res !== undefined && res.data.status !== 'error' && 'flash' in res.data) {
    ctx.app.$notify({
      title: capitalize(res.data.status),
      text: res.data.flash,
      type: res.data.status
    })
  }
  return res
}
