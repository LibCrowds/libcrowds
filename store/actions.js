export default {
  UPDATE_CURRENT_USER: async ({ dispatch, commit }, axios) => {
    return axios.$get(`/account/profile`).then(data => {
      if ('user' in data) {
        commit('LOGIN', data.user)
      } else {
        commit('LOGOUT')
      }
    })
  },

  LOGOUT: ({ commit }) => {
    commit('LOGOUT')
  },

  UPDATE_ANNOUNCEMENTS: async ({ commit, state }, axios) => {
    return axios.$get('/api/announcement', {
      params: {
        orderby: 'created',
        desc: true
      }
    }).then(data => {
      commit('SET_ITEM', {
        key: 'announcements', value: data
      })
    })
  },

  UPDATE_COLLECTION: ({ commit }, collection) => {
    commit('SET_ITEM', {
      key: 'collection', value: collection
    })
  }
}
