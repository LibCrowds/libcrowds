import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

/**
 * Fetch a collection by the short_name param and update the store.
 */
export const fetchCollectionByName = {
  fetch ({ params, app, error, store }) {
    return app.$axios.$get('/api/category', { params: params }).then(data => {
      if (!data || data.length !== 1) {
        error({ statusCode: 404, message: 'Page not found' })
        return
      }
      setCollectionDefaults(data[0])
      store.dispatch('UPDATE_COLLECTION', data[0])
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  }
}
