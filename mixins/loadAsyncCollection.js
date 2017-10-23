import merge from 'lodash/merge'

export const loadAsyncCollection = {
  async asyncData ({ params, app, error, store }) {
    const defaultInfo = {
      forum: null,
      tagline: '',
      background: null,
      terminology: {
        project: 'project',
        task: 'task',
        taskRun: 'task run'
      },
      license: 'CC0',
      presenter: null,
      content: {
        about: '',
        data: '',
        contribute: ''
      },
      pubished: false
    }

    return app.$axios.$get('/api/category', {
      params: {
        short_name: params.shortname
      }
    }).then(data => {
      if (!data.length) {
        error({ statusCode: 404, message: 'Page not found' })
      }
      data[0].info = merge(defaultInfo, data[0].info) // Merge default info
      store.dispatch('UPDATE_COLLECTION', data[0])
      return {
        collection: data[0]
      }
    }).catch(err => {
      error({ statusCode: err.statusCode, message: err.message })
    })
  },

  validate ({ params }) {
    return params.shortname !== undefined
  }
}
