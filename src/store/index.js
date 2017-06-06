import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    siteConfig: {}
  },

  mutations: {
    SET_SITE_CONFIG: (state, obj) => {
      state.siteConfig = obj
    }
  }
})

export default store
