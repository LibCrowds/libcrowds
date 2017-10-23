export const computeFeatured = {
  computed: {
    featured () {
      // return this.$axios.$get('/api/project', {
      //   params: {
      //     category_id: this.collection.id,
      //     featured: true,
      //     all: 1
      //   }
      // }).then(data => {
      //   return data
      // }).catch(err => {
      //   this.error({ statusCode: err.statusCode, message: err.message })
      // })
      return []
    }
  }
}
