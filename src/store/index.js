import Vue from 'vue'
import Vuex from 'vuex'
import config from '@/config'
import getSiteKey from '@/utils/get-site-key'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    pybossaUsers: {}
  },

  mutations: {
    SET_ITEM: (state, obj) => {
      state[obj.key] = obj.val
    },
    DEL_ITEM: (state, obj) => {
      state[obj.key].splice(obj.index, 1)
    }
  },

  actions: {
    login: ({ commit, state }, siteKey, csrf) => {
      const host = config[siteKey]
      const opts = {
        headers: {
          'X-CSRFToken': csrf
        }
      }
      const users = pybossaUsers
      this.$http.get(`${host}/account/signin`, null, opts).then(response => {
        users[siteKey]
        commit('LOGIN', { siteKey: siteKey, user: response.body })
      }, response => {
        // error callback
      })
    },

    logout: ({ commit }, siteKey) => {
      const host = config[siteKey]
      this.$http.get(`${host}/account/signout`).then(response => {
        commit('LOGOUT', { siteKey: siteKey })
      }, response => {
        // error callback
      })
    }
  },

  getters: {
    loggedIn: (state, getters) => {
      const key = getSiteKey()
      return key in state.pybossaUsers
    }
  }
})

export default store
