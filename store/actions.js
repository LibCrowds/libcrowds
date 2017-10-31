import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

export default {
  UPDATE_CURRENT_USER: ({ dispatch, commit }, axios) => {
    // TODO remove multiple calls after cache properly busted
    // https://github.com/Scifabric/pybossa/issues/1697
    let user = {}
    return axios.$get(`/account/profile`).then(data => {
      if (data.hasOwnProperty('user')) {
        user = data.user
        axios.$get(`/api/user/${data.user.id}`).then(userData => {
          user.info = userData.info
          commit('LOGIN', user)
        })
      } else {
        commit('LOGOUT')
      }
    })
  },

  LOGOUT: ({ commit }) => {
    commit('LOGOUT')
  },

  UPDATE_PUBLISHED_COLLECTIONS: ({ commit, state }, axios) => {
    return axios.$get('/api/category', {
      params: {
        limit: 100,
        info: 'published::true',
        orderby: 'created',
        desc: true
      }
    }).then(data => {
      commit('SET_ITEM', {
        key: 'publishedCollections', value: data
      })
    })
  },

  LOAD_COLLECTION: ({ commit }, requestPromise) => {
    return requestPromise.then(data => {
      if (!data || !data.length === 1) {
        throw new Error({ statusCode: 404, message: 'Page not found' })
      }

      setCollectionDefaults(data[0])
      commit('SET_ITEM', {
        key: 'collection', value: data[0]
      })
    }).catch(err => {
      throw new Error({ statusCode: err.statusCode, message: err.message })
    })
  },

  UPDATE_CURRENT_COLLECTION: ({ commit }, collection) => {
    commit('SET_ITEM', {
      key: 'currentCollection', value: collection
    })
  },

  UPDATE_CURRENT_PROJECT: ({ commit }, project) => {
    commit('SET_ITEM', {
      key: 'currentProject', value: project
    })
  },

  UPDATE_LAST_ANNOUNCEMENT: ({ commit }, axios) => {
    return axios.get('/api/announcement', {
      params: {
        orderby: 'created',
        published: true,
        desc: true,
        limit: 1
      }
    }).then(res => {
      if (res.data.length) {
        commit('SET_ITEM', {
          key: 'lastAnnouncement', value: res.data[0]
        })
      }
    })
  },

  UPDATE_LAST_READ: ({ state, dispatch }, axios) => {
    const announcements = state.currentUser.info.announcements || {}
    announcements.last_read = state.lastAnnouncement.id
    state.currentUser.info.announcements = announcements
    return axios.$put(`/api/user/${state.currentUser.id}`, {
      info: state.currentUser.info
    }).then(data => {
      dispatch('UPDATE_CURRENT_USER', axios)
    })
  },

  UPDATE_COLLECTION_NAV_ITEMS: ({ commit }, nodes) => {
    const navItems = []
    console.log(nodes)
    for (let node of nodes) {
      navItems.push({
        id: node.id,
        text: node.getAttribute('data-title') || node.innerHTML
      })
    }
    commit('SET_ITEM', {
      key: 'collectionNavItems', value: navItems
    })
  }
}
