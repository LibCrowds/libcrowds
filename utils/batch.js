/**
 * Return an array of arrays, each a batch of n items.
 * @param {Array} items
 *   The items.
 * @param {Number} n
 *   The size of each batch.
 * @param {*} fillWith
 *   The item to fill any incomplete batch with.
 */
export const batch = function (items, n, fillWith) {
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
    if (fillWith !== undefined && tmp.length < n) {
      for (let i = 0; i < n - tmp.length; i++) {
        tmp.push(fillWith)
      }
    }
    batched.push(tmp)
  }
  console.log(batch)
  return batched
}
