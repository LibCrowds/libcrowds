import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

/**
 * Loads a collection asynchronously, setting defaults and updating the store.
 */
export const loadAsyncCollection = {
  async asyncData ({ params, app, error, store }) {
    return app.$axios.$get('/api/category', {
      params: {
        short_name: params.shortname
      }
    }).then(data => {
      if (!data.length) {
        error({ statusCode: 404, message: 'Page not found' })
      }

      setCollectionDefaults(data[0])
      store.dispatch('UPDATE_COLLECTION', data[0])
      return {
        collection: data[0]
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  validate ({ params }) {
    return params.shortname !== undefined
  }
}
