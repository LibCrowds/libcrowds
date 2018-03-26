import Vuex from 'vuex'

import mutations from '@/store/mutations'
import actions from '@/store/actions'

actions.nuxtServerInit = async ({ dispatch }, { app }) => {
  const user = await dispatch('UPDATE_CURRENT_USER', app.$axios)
  await dispatch('UPDATE_PUBLISHED_COLLECTIONS', app.$axios)
  await dispatch('UPDATE_N_PENDING_TEMPLATES', app.$axios)

  // Sign in to Flarum in case we have been redirected back to LibCrowds
  // following a PYBOSSA SSO sign in
  if (user) {
    await app.$flarum.signin(user.name, user.email_addr)
  }

  // Toggle dark mode
  if (app.$cookies.get('dark-mode') === 'true') {
    await dispatch('TOGGLE_DARK_MODE')
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
