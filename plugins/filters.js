import Vue from 'vue'
import capitalize from '@/utils/capitalize'
import formatDate from '@/utils/formatDate'
import intComma from '@/utils/intComma'
import pluralize from 'pluralize'

Vue.filter('formatDate', formatDate)
Vue.filter('pluralize', pluralize)
Vue.filter('capitalize', capitalize)
Vue.filter('intComma', intComma)
