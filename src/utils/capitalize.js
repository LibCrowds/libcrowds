/**
 * Capitalize a String.
 * @param {String} text
 *   The text.
 */
export default function (text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}
