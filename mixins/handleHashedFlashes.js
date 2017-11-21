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
      const flash = params.flash
      if (flash) {
        const decodedFlash = decodeURIComponent(flash)
        const jsonStr = atob(decodedFlash)
        const json = JSON.parse(jsonStr)
        this.flash(json)
      }
    }
  }
}
