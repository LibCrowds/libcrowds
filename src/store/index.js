import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    siteConfig: {},
    currentUser: {},
    csrfToken: null,
    notification: null
  },

  mutations: {
    SET_SITE_CONFIG: (state, siteConfig) => {
      state.siteConfig = siteConfig
    },
    SET_CSRF_TOKEN: (state, csrfToken) => {
      state.csrfToken = csrfToken
    },
    SET_NOTIFICATION: (state, notification) => {
      state.notification = notification
    }
  }
})

export default store
