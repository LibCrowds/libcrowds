import Vuex from 'vuex'

import mutations from '@/store/mutations'
import actions from '@/store/actions'

actions.nuxtServerInit = async ({ dispatch }, { app }) => {
  await dispatch('UPDATE_CURRENT_USER', app.$axios)
  await dispatch('UPDATE_PUBLISHED_COLLECTIONS', app.$axios)
  await dispatch('UPDATE_N_PENDING_TEMPLATES', app.$axios)

  if (app.$cookies.get('dark-mode') === 'true') {
    await dispatch('TOGGLE_DARK_MODE')
  }
}

// nuxtClientInit is dispatched from plugins/nuxt-client-init
actions.nuxtClientInit = ({ state }, { app }) => {
  if (state.currentUser.id && app.$flarum) {
    app.$flarum.signin(state.currentUser.name, state.currentUser.email_addr)
  }
}

export default () => {
  return new Vuex.Store({
    state: {
      darkMode: false,
      currentUser: {},
      publishedCollections: [],
      currentCollection: {},
      collectionNavItems: [],
      currentProject: {},
      currentTemplate: {},
      nPendingTemplates: 0
    },

    mutations,

    actions
  })
}
