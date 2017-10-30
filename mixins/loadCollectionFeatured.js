import merge from 'lodash/merge'

export const loadCollectionFeatured = {
  data () {
    return {
      featured: []
    }
  },

  methods: {
    loadCollectionFeatured () {
      let projects = []
      this.$axios.$get('/api/project', {
        params: {
          category_id: this.collection.id,
          featured: true,
          all: 1
        }
      }).then(data => {
        projects = data
        return this.$axios.$get('/api/projectstats', {
          params: {
            project_id: data.map(project => project.id).toString()
          }
        })
      }).then(data => {
        this.featured = projects.map((project, idx) => {
          return merge(data[idx], project)
        })
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    }
  }
}
