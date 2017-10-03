import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import siteConfig from '@/siteConfig'
import PyBossaApi from '@/api/pybossa'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentUser: {},
    notification: {},
    pybossa: {}
  },

  mutations: {
    SET_ITEM: (state, obj) => {
      state[obj.key] = obj.value
    },
    DELETE_ITEM: (state, key) => {
      state[key] = null
    },
    LOGIN: (state, user) => {
      state.currentUser = user
    },
    LOGOUT: (state) => {
      state.currentUser = {}
    }
  },

  actions: {
    UPDATE_CURRENT_USER: ({ commit }) => {
      this.pybossa.get('/account/profile').then(r => {
        if ('user' in r.data) {
          commit('LOGIN', r.data.user)
        } else {
          commit('LOGOUT')
        }
      })
    },

    LOGOUT: ({ commit }) => {
      this.pybossa.get('/account/signout').then(r => {
        if (r.data.next === '/') {
          router.push({ name: 'landing' })
        }
        commit('LOGOUT')
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
    },

    LOAD_PYBOSSA_API: ({ commit, state }, pybossaHost => {
      const pybossa = new PyBossaApi(pybossaHost)
      commit('SET_ITEM', { key: 'pybossa', value: pybossa })
    })
  }
})

export default store
