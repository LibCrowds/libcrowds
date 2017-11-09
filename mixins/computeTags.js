/**
 * Method to batch tags for the current collection by type.
 *
 * Adds a key by which the tag can later be identified.
 */
export const computeTags = {
  computed: {
    tags () {
      const batches = []
      const tags = this.$store.state.currentCollection.info.tags
      const uniqueTypes = [...new Set(tags.map(tag => tag.type))]
      for (let type of uniqueTypes) {
        batches.push({
          type: type,
          key: `tag:${encodeURI(type.replace(/\s+/g, '_').toLowerCase())}`,
          options: tags.filter(tag => {
            return tag.type === type
          })
        })
      }
      return batches
    }
  }
}
