import pybossa from '@/api/pybossa'

export default {
  UPDATE_CURRENT_USER: async ({ dispatch, commit }) => {
    const res = await pybossa.getProfile()
    if ('user' in res.data) {
      commit('LOGIN', res.data.user)
    } else {
      commit('LOGOUT')
    }
  },

  LOGOUT: async ({ commit }, callback) => {
    const res = await pybossa.signout()
    callback(res)
    commit('LOGOUT')
  },

  UPDATE_ANNOUNCEMENTS: async ({ commit, state }) => {
    let res = await pybossa.client.get('/api/announcement', {
      params: {
        orderby: 'created',
        desc: true
      }
    })
    commit('SET_ITEM', {
      key: 'announcements', value: res.data
    })
  }
}
