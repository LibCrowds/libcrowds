import Vue from 'vue'
import Vuex from 'vuex'
import { create } from '@/api/pybossa'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    siteConfig: {},
    pybossaApi: {}
  },

  mutations: {
    SET_PYBOSSA_SITE: (state, siteConfig) => {
      state.siteConfig = siteConfig
      state.pybossaApi = create(siteConfig)
    }
  }
})

export default store
