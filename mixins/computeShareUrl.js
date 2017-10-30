export const computeShareUrl = {
  computed: {
    shareUrl () {
      return process.browser ? window.location.href : ''
    }
  }
}
