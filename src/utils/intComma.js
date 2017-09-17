/**
 * Add commas to an integer.
 * @param {Number|String} n
 *   The number.
 */
export default function (n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
