import Vue from 'vue'
import Vuex from 'vuex'
import pybossa from '@/api/pybossa'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    siteConfig: {},
    pybossaApi: {}
  },

  mutations: {
    SET_SITE_CONFIG: (state, siteConfig) => {
      state.siteConfig = siteConfig
    },
    SET_PYBOSSA_API: (state, siteConfig) => {
      state.pybossaApi = pybossa(siteConfig)
    }
  }
})

export default store
