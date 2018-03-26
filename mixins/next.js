/**
 * A mixin for redirecting to in internal or external URL.
 */
export const next = {
  methods: {
    /**
     * Redirect to a URL.
     * @param {String} url
     *   The URL.
     */
    next (url) {
      const origin = window.location.origin
      const isInternal = url && (url.startsWith(origin) || url.startsWith('/'))

      if (isInternal) {
        this.$router.push({ path: url })
      } else if (url) {
        window.open(url)
      }
    }
  }
}
