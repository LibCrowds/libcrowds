import { setCollectionDefaults } from '@/utils/setCollectionDefaults'

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

  UPDATE_PUBLISHED_COLLECTIONS: async ({ commit, state }, axios) => {
    return axios.$get('/api/category', {
      params: {
        limit: 100,
        info: 'published::true',
        orderby: 'created',
        desc: true
      }
    }).then(data => {
      console.log(data)
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

  UPDATE_COLLECTION: ({ commit }, collection) => {
    commit('SET_ITEM', {
      key: 'collection', value: collection
    })
  },

  UPDATE_PROJECT: ({ commit }, project) => {
    commit('SET_ITEM', {
      key: 'project', value: project
    })
  }
}
