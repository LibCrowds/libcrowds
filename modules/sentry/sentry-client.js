import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import localConfig from '@/local.config'

// Install Raven client (options are passed from sentry.js)
Raven
  .config(`https://${options.public_key}@sentry.io/${options.project_id}`)
  .addPlugin(RavenVue, Vue)
  .install()
