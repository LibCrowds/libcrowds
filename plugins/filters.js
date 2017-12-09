import Vue from 'vue'
import capitalize from 'capitalize'
import pluralize from 'pluralize'

Vue.filter('capitalize', capitalize)

Vue.filter('pluralize', pluralize)

Vue.filter('intComma', (n) => {
  if (n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return 0
})

Vue.filter('truncate', (str, n = 30) => {
  return `${str.slice(0, n)}...`
})
