import isEmpty from 'lodash/isEmpty'
import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

/**
 * Fetch a collection by the short_name param and update the store.
 */
export const fetchCollectionById = {
  fetch ({ params, app, error, store }) {
    return app.$axios.$get(`/api/category/${params.id}`).then(data => {
      if (isEmpty(data)) {
        error({ statusCode: 404, message: 'Page not found' })
        return
      }
      setCollectionDefaults(data)
      store.dispatch('UPDATE_CURRENT_COLLECTION', data)
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  }
}
