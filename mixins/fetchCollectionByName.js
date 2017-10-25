import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

/**
 * Loads a collection asynchronously, setting defaults and updating the store.
 */
export const fetchCollectionByName = {
  fetch ({ params, app, error, store }) {
    return app.$axios.$get('/api/category', { params: params }).then(data => {
      if (!data || data.length !== 1) {
        store.dispatch('UPDATE_COLLECTION', {})
        error({ statusCode: 404, message: 'Page not found' })
        return
      }
      setCollectionDefaults(data[0])
      store.dispatch('UPDATE_COLLECTION', data[0])
    }).catch(err => {
      store.dispatch('UPDATE_COLLECTION', {})
      error({ statusCode: err.statusCode, message: err.message })
    })
  }
}
