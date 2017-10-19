import pybossa from '@/api/pybossa'

export default {
  UPDATE_CURRENT_USER: ({ dispatch, commit }) => {
    pybossa.getProfile().then(r => {
      if ('user' in r.data) {
        commit('LOGIN', r.data.user)
      } else {
        commit('LOGOUT')
      }
      dispatch('UPDATE_ANNOUNCEMENTS')
    })
  },

  LOGOUT: ({ commit }) => {
    pybossa.signout().then(data => {
      if (data.next === '/') {
        this.$router.push({ name: 'index' })
      }
      commit('LOGOUT')
    })
  },

  UPDATE_ANNOUNCEMENTS: ({ commit, state }) => {
    if (!(state.currentUser.info)) {
      commit('SET_ITEM', {
        key: 'announcements', value: []
      })
    } else {
      let announcements = state.currentUser.info.announcements || {}
      let lastId = announcements['last_read'] || 0
      pybossa.client.get(`/api/announcement?last_id=${lastId}`).then(r => {
        commit('SET_ITEM', {
          key: 'announcements', value: r.data
        })
      })
    }
  }
}
