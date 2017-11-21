import queryString from 'query-string'
import { notifications } from '@/mixins/notifications'

/**
 * A mixin to handle hashed flash messages returned from PYBOSSA.
 */
export const handleHashedFlashes = {
  mixins: [ notifications ],

  mounted () {
    if (process.browser) {
      const params = queryString.parse(location.search)
      if (params.hasOwnProperty('flash')) {
        this.flash(params.flash)
      }
    }
  }
}
