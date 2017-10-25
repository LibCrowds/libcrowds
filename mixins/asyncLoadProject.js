/**
 * Loads a project, with it's related collection, and updates the store.
 */
export const asyncLoadProject = {
  async asyncData ({ params, app, error, store }) {
    return app.$axios.$get('/api/project', {
      params: params
    }).then(data => {
      if (!data.length) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      store.dispatch('UPDATE_PROJECT', data[0])
      return {
        project: data[0]
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  }
}
