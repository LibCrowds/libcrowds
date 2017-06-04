import Vue from 'vue'
import Vuex from 'vuex'

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
    },

    logout: ({ commit }, siteKey) => {
    }
  },

  getters: {
    loggedIn: (state, getters) => {
    }
  }
})

export default store
