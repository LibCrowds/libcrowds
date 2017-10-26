import merge from 'lodash/merge'
import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

export default {
  UPDATE_CURRENT_USER: async ({ dispatch, commit }, axios) => {
    // TODO remove multiple calls after cache properly busted
    // https://github.com/Scifabric/pybossa/issues/1697
    const data = await axios.$get(`/account/profile`)
    if ('user' in data) {
      const extraInfoData = await axios.$get(`/api/user/${data.user.id}`)
      data.user.info = extraInfoData.info
      commit('LOGIN', data.user)
    } else {
      commit('LOGOUT')
    }
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

  UPDATE_PUBLISHED_COLLECTIONS: async ({ commit, state }, axios) => {
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

  LOAD_COLLECTION: async ({ commit }, requestPromise) => {
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

  UPDATE_CURRENT_COLLECTION: async ({ commit }, collection) => {
    commit('SET_ITEM', {
      key: 'currentCollection', value: collection
    })
  },

  UPDATE_CURRENT_PROJECT: async ({ commit }, project) => {
    commit('SET_ITEM', {
      key: 'currentProject', value: project
    })
  },

  UPDATE_LAST_ANNOUNCEMENT: async ({ commit }, axios) => {
    return axios.get('/api/announcement', {
      params: {
        orderby: 'created',
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
  }
}
