import { notifications } from '@/mixins/notifications'
/**
 * A mixin to handle hashed flash messages returned from PYBOSSA.
 */
export const handleHashedFlashes = {
  mixins: [ notifications ],

  mounted () {
    if (process.browser && window.location.hash) {
      const hash = window.location.hash
      const decodedHash = decodeURIComponent(hash).replace(/^#/, '')
      const jsonStr = atob(decodedHash)
      const json = JSON.parse(jsonStr)
      this.flash(json)
    }
  }
}
