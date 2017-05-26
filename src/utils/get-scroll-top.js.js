/**
 * Cross-browser method to get scroll top (probably needs work).
 */
function getScrollTop () {
  const ieScrollTop = document.documentElement.scrollTop
  return document.body.scrollTop === 0 ? ieScrollTop : document.body.scrollTop
}

export default getScrollTop
