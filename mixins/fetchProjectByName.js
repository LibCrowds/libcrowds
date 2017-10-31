/**
 * Fetch a project by the short_name param and update the store.
 */
export const fetchProjectByName = {
  fetch ({ params, app, error, store }) {
    return app.$axios.$get('/api/project', {
      params: {
        short_name: params.short_name,
        all: 1
      }
    }).then(data => {
      if (!data || data.length !== 1) {
        error(new Error({ statusCode: 404 }))
        return
      }
      store.dispatch('UPDATE_CURRENT_PROJECT', data[0])
    }).catch(err => {
      error(err)
    })
  }
}
