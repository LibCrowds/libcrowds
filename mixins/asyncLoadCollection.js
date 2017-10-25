import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

/**
 * Loads a collection asynchronously, setting defaults and updating the store.
 */
export const asyncLoadCollection = {
  async asyncData ({ params, app, error, store }) {
    return Promise((resolve, reject) => {
      if (store.state.project) {
        // Load the collection for the current project, if available
        const endpoint = `/api/category/${store.state.project.category_id}`
        return app.$axios.$get(endpoint)
      } else {
        // Otherwise attempt to load from URL params
        return app.$axios.$get('/api/category', { params: params })
      }
    }).then(data => {
      if (!data || !data.length === 1) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      const collection = Array.isArray(data) ? data[0] : data

      setCollectionDefaults(collection)
      store.dispatch('UPDATE_COLLECTION', collection)
      return {
        collection: collection
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  }
}
