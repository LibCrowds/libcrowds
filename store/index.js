import Vuex from 'vuex'

export default () => {
  return new Vuex.Store({
    state: {
      currentUser: {},
      notification: {},
      announcements: []
    },

    mutations: {
      SET_ITEM: (state, obj) => {
        state[obj.key] = obj.value
      },
      DELETE_ITEM: (state, key) => {
        state[key] = null
      },
      LOGIN: (state, user) => {
        state.currentUser = user
      },
      LOGOUT: (state) => {
        state.currentUser = {}
      }
    },

    actions: {
      UPDATE_CURRENT_USER: ({ dispatch, commit }) => {
        this.$pybossa.getProfile().then(r => {
          if ('user' in r.data) {
            commit('LOGIN', r.data.user)
          } else {
            commit('LOGOUT')
          }
          dispatch('UPDATE_ANNOUNCEMENTS')
        })
      },

      LOGOUT: ({ commit }) => {
        this.$pybossa.signout().then(data => {
          if (data.next === '/') {
            this.$router.push({ name: 'landing' })
          }
          commit('LOGOUT')
        })
      },

      NOTIFY: ({ commit, state }, notification) => {
        // Avoid repeated notifications
        if (
          state.notification !== null &&
          notification.type === state.notification.type &&
          notification.msg === state.notification.msg
        ) {
          return
        }
        commit('SET_ITEM', { key: 'notification', value: notification })
      },

      UPDATE_ANNOUNCEMENTS: ({ commit, state }) => {
        if (!(state.currentUser.info)) {
          commit('SET_ITEM', {
            key: 'announcements', value: []
          })
        } else {
          let announcements = state.currentUser.info.announcements || {}
          let lastId = announcements['last_read'] || 0
          this.$pybossa.client.get(`/api/announcement?last_id=${lastId}`).then(r => {
            commit('SET_ITEM', {
              key: 'announcements', value: r.data
            })
          })
        }
      }
    }
  })
}
