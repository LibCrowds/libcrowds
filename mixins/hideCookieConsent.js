/**
 * Use sparingly to hide the cookie consent banner.
 */

/*
GN: add or remove a class on the first DOM element matching a given selector.
*/
function addRemoveClass (selector, className, remove) {
  let element = document.querySelector(selector)
  if (!element) return
  let classList = element.classList
  if (!classList) return

  if (remove) {
    classList.remove(className)
  } else {
    classList.add(className)
  }
}

export const hideCookieConsent = {
  mounted () {
    if (process.browser) {
      // document.querySelector('.cc-window').style.opacity = 0
      addRemoveClass('.cc-window', 'cc-suspended')
    }
  },

  beforeDestroy () {
    if (process.browser) {
      // document.querySelector('.cc-window').style.opacity = 1
      addRemoveClass('.cc-window', 'cc-suspended', true)
    }
  }
}
