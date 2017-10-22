export default {
  UPDATE_CURRENT_USER: async ({ dispatch, commit }, axios) => {
    axios.$get(`/account/profile`).then(data => {
      if ('user' in data) {
        commit('LOGIN', data.user)
      } else {
        commit('LOGOUT')
      }
    })
  },

  LOGOUT: async ({ commit }, { axios, callback }) => {
    axios.$get('/account/signout').then(data => {
      commit('LOGOUT')
      callback(data)
    })
  },

  UPDATE_ANNOUNCEMENTS: async ({ commit, state }, axios) => {
    axios.$get('/api/announcement', {
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
