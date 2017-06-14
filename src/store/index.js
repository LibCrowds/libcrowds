import Vue from 'vue'
import Vuex from 'vuex'
import pybossaApi from '@/api/pybossa'

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
    },
    SET_CURRENT_USER: (state, currentUser) => {
      state.currentUser = currentUser
    }
  },

  actions: {
    UPDATE_CURRENT_USER: (context) => {
      pybossaApi.get('/account/profile').then(r => {
        context.commit('SET_CURRENT_USER', r.data.user)
      })
    }
  }
})

export default store
