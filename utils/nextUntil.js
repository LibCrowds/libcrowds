// See https://github.com/cferdinandi/nextUntil

/**
 * Get all html from an elem up to the elem matched by the selector.
 * @param {Element} elem
 *   The Element.
 * @param {String} selector
 *   The selector to stop before.
 * @param {String} filter
 *   Optional filter to match all siblings against.
 */
export const nextUntil = function (elem, selector, filter) {
  // matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector
  }

  // Setup siblings array
  let siblings = []

  // Get the next sibling element
  elem = elem.nextElementSibling

  // As long as a sibling exists
  while (elem) {
    // If we've reached our match, bail
    if (elem.matches(selector)) break

    // If filtering by a selector, check if the sibling matches
    if (filter && !elem.matches(filter)) {
      elem = elem.nextElementSibling
      continue
    }

    // Otherwise, push it to the siblings array
    siblings.push(elem)

    // Get the next sibling element
    elem = elem.nextElementSibling
  }
  return siblings.join('')
}
