import Vuex from 'vuex'

import mutations from '@/store/mutations'
import actions from '@/store/actions'

actions.nuxtServerInit = async ({ dispatch }) => {
  dispatch('UPDATE_CURRENT_USER')
  dispatch('UPDATE_ANNOUNCEMENTS')
}

export default () => {
  return new Vuex.Store({
    state: {
      currentUser: {},
      announcements: [],
      collection: {}
    },

    mutations,

    actions
  })
}
