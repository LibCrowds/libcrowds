/**
 * Fetch collection by short_name param and template by ID, then update store.
 */
export const fetchCollectionAndTmpl = {
  fetch ({ params, app, error, store }) {
    return app.$axios.$get('/api/category', {
      params: {
        short_name: params.short_name
      }
    }).then(data => {
      // Collection not found
      if (!data || data.length !== 1) {
        error({ statusCode: 404 })
        return
      }

      store.dispatch('UPDATE_CURRENT_COLLECTION', data[0])

      // Get template (store used as we then get the defaults set)
      let template = null
      for (let tmpl of store.state.currentCollection.info.templates) {
        if (tmpl['id'] === params.id) {
          template = tmpl
        }
      }

      // Template not found
      if (!template) {
        error({ statusCode: 404 })
        return
      }

      store.dispatch('UPDATE_CURRENT_TEMPLATE', template)
    }).catch(err => {
      error(err)
    })
  }
}
