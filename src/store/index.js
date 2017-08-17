import Vue from 'vue'
import Vuex from 'vuex'
import pybossaApi from '@/api/pybossa'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
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
      pybossaApi.get('/account/profile').then(r => {
        console.log(r)
        if ('user' in r.data) {
          commit('SET_ITEM', { key: 'currentUser', value: r.data.user })
        } else {
          commit('SET_ITEM', { key: 'currentUser', value: null })
        }
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
