import Vue from 'vue'
import Vuex from 'vuex'
import pybossaApi from '@/api/pybossa'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    updatingCurrentUser: false,
    currentUser: null,
    csrfToken: null,
    notification: {}
  },

  mutations: {
    SET_ITEM: (state, obj) => {
      state[obj.key] = obj.value
    },
    DELETE_ITEM: (state, key) => {
      state[key] = null
    }
  },

  actions: {
    UPDATE_CURRENT_USER: ({ commit }) => {
      if (this.updatingCurrentUser) {
        return
      }
      this.updatingCurrentUser = true
      let currentUser = null

      pybossaApi.get('/account/profile').then(r => {
        currentUser = r.data.user
        return pybossaApi.get('/api/user')
      }).then(r => {
        currentUser.admin = 'id' in r.data[0]
        commit('SET_ITEM', { key: 'currentUser', value: currentUser })
        this.updatingCurrentUser = false
      })
    },

    NOTIFY: ({ commit, state }, notification) => {
      // Avoid repeated notifications
      if (state.notification !== null &&
          notification.type === state.notification.type &&
          notification.msg === state.notification.msg) {
        return
      }
      commit('SET_ITEM', { key: 'notification', value: notification })
    }
  }
})

export default store
