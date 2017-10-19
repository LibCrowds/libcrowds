/**
 * Return an array of arrays, each a batch of n items.
 * @param {Array} items
 * @param {Number} n
 * @param {Object} fillWith
 */
export const batch = function (items, n, fillWith = null) {
  let batched = []
  let tmp = []
  for (let item of items) {
    if (tmp.length === n) {
      batched.push(tmp)
      tmp = []
    }
    tmp.push(item)
  }
  if (tmp.length) {
    if (fillWith && tmp.length < n) {
      for (let i = 0; i < n - tmp.length; i++) {
        tmp.push(fillWith)
      }
    }
  }
  return batched
}
