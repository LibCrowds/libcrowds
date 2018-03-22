/**
 * Fetch a collection by the short_name param and update the store.
 */
export const fetchCollectionByName = {
  fetch ({ params, app, error, store }) {
    return app.$axios.$get('/api/category', {
      params: {
        short_name: params.short_name
      }
    }).then(data => {
      if (!data || data.length !== 1) {
        error({ statusCode: 404 })
        return
      }
      store.dispatch('UPDATE_CURRENT_COLLECTION', data[0])
    }).catch(err => {
      error(err)
    })
  }
}
