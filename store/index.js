import Vuex from 'vuex'

import mutations from '@/store/mutations'
import actions from '@/store/actions'

actions.nuxtServerInit = async ({ dispatch }, { app }) => {
  dispatch('UPDATE_CURRENT_USER', app.$axios)
  dispatch('UPDATE_ANNOUNCEMENTS', app.$axios)
}

export default () => {
  return new Vuex.Store({
    state: {
      currentUser: {},
      announcements: [],
      collection: {},
      project: {}
    },

    mutations,

    actions
  })
}
