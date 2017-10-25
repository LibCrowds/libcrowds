/**
 * Method to batch tags for the current collection by type.
 */
export const tags = {
  computed: {
    tags () {
      const batches = []
      const tags = this.$store.state.currentCollection.info.tags
      const uniqueTypes = [...new Set(tags.map(tag => tag.type))]
      for (let type of uniqueTypes) {
        batches.push({
          type: type,
          short_type: encodeURI(type.replace(/\s+/g, '_').toLowerCase()),
          options: tags.filter(tag => {
            return tag.type === type
          })
        })
      }
      return batches
    }
  }
}
