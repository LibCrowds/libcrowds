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

  LOGOUT: async ({ commit }, axios) => {
    return axios.$get('/account/signout').then(data => {
      commit('LOGOUT')
    })
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
  }
}
