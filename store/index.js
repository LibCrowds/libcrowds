import Vuex from 'vuex'

import mutations from '@/store/mutations'
import actions from '@/store/actions'

actions.nuxtServerInit = async ({ dispatch }, { app }) => {
  // Feed initial store state asynchronously
  await dispatch('UPDATE_CURRENT_USER', app.$axios)
  await dispatch('UPDATE_ANNOUNCEMENTS', app.$axios)
  await dispatch('UPDATE_PUBLISHED_COLLECTIONS', app.$axios)
}

export default () => {
  return new Vuex.Store({
    state: {
      currentUser: {},
      announcements: [],
      publishedCollections: [],
      currentCollection: {},
      collectionNavItems: [],
      currentProject: {},
      lastAnnouncement: {}
    },

    mutations,

    actions
  })
}
