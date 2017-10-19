import Vue from 'vue'
import capitalize from 'capitalize'
import pluralize from 'pluralize'

Vue.filter('capitalize', capitalize)

Vue.filter('pluralize', pluralize)

Vue.filter('intComma', (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.filter('batch', (items, n, fillWith = null) => {
  let batchedItems = []
  let batch = []
  for (let item of items) {
    if (batch.length === n) {
      batchedItems.push(batch)
      batch = []
    }
    batch.push(item)
  }
  if (batch.length) {
    if (fillWith && batch.length < n) {
      for (let i = 0; i < n - batch.length; i++) {
        batch.push(fillWith)
      }
    }
  }
  return batchedItems
})
