/**
 * Fetch a collection by the current project.
 */
export const fetchProjectAndCollection = {
  fetch ({ params, app, error, store }) {
    return app.$axios.$get('/api/project', {
      params: {
        short_name: params.short_name,
        all: 1
      }
    }).then(data => {
      if (!data || data.length !== 1) {
        error({ statusCode: 404 })
      } else {
        store.dispatch('UPDATE_CURRENT_PROJECT', data[0])
        return app.$axios.$get(`/api/category/${data[0].category_id}`)
      }
    }).then(data => {
      store.dispatch('UPDATE_CURRENT_COLLECTION', data)
    }).catch(err => {
      error(err)
    })
  }
}
