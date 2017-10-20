import pybossa from '@/api/pybossa'

export default {
  UPDATE_CURRENT_USER: ({ dispatch, commit }) => {
    pybossa.getProfile().then(r => {
      if ('user' in r.data) {
        commit('LOGIN', r.data.user)
      } else {
        commit('LOGOUT')
      }
    })
  },

  LOGOUT: ({ commit }, callback) => {
    pybossa.signout().then(res => {
      callback(res)
      commit('LOGOUT')
    })
  },

  UPDATE_ANNOUNCEMENTS: ({ commit, state }) => {
    if (state.currentUser.info === undefined) {
      commit('SET_ITEM', {
        key: 'announcements', value: []
      })
    } else {
      pybossa.client.get('/api/announcement', {
        params: {
          orderby: 'created',
          desc: true
        }
      }).then(r => {
        commit('SET_ITEM', {
          key: 'announcements', value: r.data
        })
      })
    }
  }
}
