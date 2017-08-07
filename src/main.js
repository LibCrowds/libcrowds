import 'es6-promise/auto'

import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import BootstrapVue from 'bootstrap-vue'
import VueGravatar from 'vue-gravatar'
import VueChartist from 'vue-chartist'
import VueFormGenerator from 'vue-form-generator'
import VueImages from 'vue-images'
import VueAnalytics from 'vue-analytics'
import LibcrowdsViewer from 'libcrowds-viewer'
import ToggleButton from 'vue-js-toggle-button'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

import '@/icons'
import App from '@/App'
import store from '@/store'
import router from '@/router'
import PyBossaModalForm from '@/components/global/PyBossaModalForm'
import config from '@/config'

// Global styles
import '@/assets/style/main.scss'

Vue.use(BootstrapVue)
Vue.use(VueChartist)
Vue.use(VueFormGenerator)
Vue.use(ToggleButton)
Vue.use(LibcrowdsViewer)

Vue.component('v-gravatar', VueGravatar)
Vue.component('v-images', VueImages)
Vue.component('pybossa-modal-form', PyBossaModalForm)

// Google analytics
if ('analytics' in config && process.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    id: config.analytics,
    router
  })
}

// Sentry error logging
if ('sentryPublicDsn' in config) {
  Raven
    .config(config.sentryPublicDsn, {
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
