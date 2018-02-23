import queryString from 'query-string'

/**
 * A mixin to handle hashed flash messages returned from PYBOSSA.
 */
export const handleHashedFlashes = {
  mounted () {
    if (process.browser) {
      const params = queryString.parse(location.search)
      const flash = params.flash
      if (flash) {
        const decodedFlash = decodeURIComponent(flash)
        const jsonStr = atob(decodedFlash)
        const json = JSON.parse(jsonStr)
        this.$notifications.flash(json)
      }
    }
  }
}
