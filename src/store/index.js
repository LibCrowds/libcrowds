import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    siteConfig: {}
  },

  mutations: {
    SET_ITEM: (state, obj) => {
      state[obj.key] = obj.val
    },
    DEL_ITEM: (state, obj) => {
      state[obj.key].splice(obj.index, 1)
    },
    ADD_ITEM: (state, obj) => {
      state[obj.key].unshift(obj.val)
    }
  }
})

export default store
