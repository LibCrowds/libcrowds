/**
 * Dispatch the nuxt client init event.
 *
 * This is used to that we can asynchronously perform actions that are only
 * available on the client, before rendering.
 */
export default (ctx) => {
  if (ctx.isClient) {
    ctx.store.dispatch('nuxtClientInit', ctx)
  }
}
