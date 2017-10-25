import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

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
        error({ statusCode: 404, message: 'Page not found' })
      } else {
        store.dispatch('UPDATE_PROJECT', data[0])
        return app.$axios.$get(`/api/category/${data[0].category_id}`)
      }
    }).then(data => {
      setCollectionDefaults(data)
      store.dispatch('UPDATE_COLLECTION', data)
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  }
}
