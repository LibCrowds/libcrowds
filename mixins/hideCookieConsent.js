/**
 * Use sparingly to hide the cookie consent banner.
 */
export const hideCookieConsent = {
  mounted () {
    if (process.browser) {
      document.querySelector('.cc-window').style.opacity = 0
    }
  },

  beforeDestroy () {
    if (process.browser) {
      document.querySelector('.cc-window').style.opacity = 1
    }
  }
}
