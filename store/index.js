import Vuex from 'vuex'

import mutations from '@/store/mutations'
import actions from '@/store/actions'

actions.nuxtServerInit = async ({ dispatch }, { app }) => {
  await dispatch('UPDATE_PUBLISHED_COLLECTIONS', app.$axios)
}

actions.nuxtClientInit = async ({ dispatch }, { app }) => {
  await dispatch('UPDATE_CURRENT_USER', app.$axios)
  await dispatch('UPDATE_LAST_ANNOUNCEMENT', app.$axios)
}

export default () => {
  return new Vuex.Store({
    state: {
      currentUser: {},
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
