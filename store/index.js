import Vuex from 'vuex'

import mutations from '@/store/mutations'
import actions from '@/store/actions'

actions.nuxtServerInit = async ({ dispatch }, { app }) => {
  // UPDATE_CURRENT_USER is called from router middleware
  dispatch('UPDATE_ANNOUNCEMENTS', app.$axios)
  dispatch('UPDATE_PUBLISHED_COLLECTIONS', app.$axios)
}

export default () => {
  return new Vuex.Store({
    state: {
      currentUser: {},
      announcements: [],
      publishedCollections: [],
      currentCollection: {},
      currentProject: {},
      lastAnnouncement: {}
    },

    mutations,

    actions
  })
}
