import Vuex from 'vuex'

import mutations from '@/store/mutations'
import actions from '@/store/actions'

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
