export const loadCollectionFeatured = {
  data () {
    return {
      featured: []
    }
  },

  methods: {
    loadCollectionFeatured () {
      this.$axios.$get('/api/project', {
        params: {
          category_id: this.collection.id,
          featured: true,
          all: 1
        }
      }).then(data => {
        this.featured = data
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    }
  }
}
