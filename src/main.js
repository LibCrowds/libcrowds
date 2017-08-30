import 'es6-promise/auto'

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import BootstrapVue from 'bootstrap-vue'
import VueGravatar from 'vue-gravatar'
import VueChartist from 'vue-chartist'
import VueFormGenerator from 'vue-form-generator'
import VueImages from 'vue-images'
import VueAnalytics from 'vue-analytics'
import VueProgressBar from 'vue-progressbar'
import Icon from 'vue-awesome/components/Icon'
import LibcrowdsViewer from 'libcrowds-viewer'
import ToggleButton from 'vue-js-toggle-button'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

import App from '@/App'
import store from '@/store'
import router from '@/router'
import siteConfig from '@/siteConfig'
import formatDate from '@/filters/formatDate'

// Global styles
import '@/assets/style/main.scss'

Vue.use(BootstrapVue)
Vue.use(VueChartist)
Vue.use(VueFormGenerator)
Vue.use(ToggleButton)
Vue.use(LibcrowdsViewer)
Vue.use(VueProgressBar)

Vue.component('v-gravatar', VueGravatar)
Vue.component('v-images', VueImages)
Vue.component('icon', Icon)

Vue.filter('formatDate', formatDate)

// Google analytics
if ('analytics' in siteConfig && process.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    id: siteConfig.analytics,
    router
  })
}

// Sentry error logging
if ('sentryPublicDsn' in siteConfig && process.env.NODE_ENV === 'production') {
  Raven
    .config(siteConfig.sentryPublicDsn, {
      environment: process.env.NODE_ENV
    })
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.config.productionTip = (process.env.NODE_ENV !== 'production')

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  render: h => h(App)
})
