import isEmpty from 'lodash/isEmpty'
import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

/**
 * Fetch a collection by the short_name param and update the store.
 */
export const fetchCollectionById = {
  fetch ({ params, app, error, store }) {
    return app.$axios.$get(`/api/category/${params.id}`).then(data => {
      if (isEmpty(data)) {
        error(new Error({ statusCode: 404 }))
        return
      }
      setCollectionDefaults(data)
      store.dispatch('UPDATE_CURRENT_COLLECTION', data)
    }).catch(err => {
      error(err)
    })
  }
}
