import Vue from 'vue'
import Vuex from 'vuex'
import pybossaApi from '@/api/pybossa'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    siteConfig: null,
    currentUser: null,
    csrfToken: null,
    notification: null
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
        console.log(r.data.user)
        commit('SET_ITEM', { key: 'currentUser', value: r.data.user })
      })
    }
  }
})

export default store
