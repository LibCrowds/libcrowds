/**
 * Computed to batch tags by type.
 */
export const tags = {
  computed: {
    tags () {
      const batches = []
      const tags = this.collection.info.tags
      const uniqueTypes = [...new Set(tags.map(tag => tag.type))]
      for (let type of uniqueTypes) {
        batches.push({
          type: type,
          options: tags.filter(tag => {
            return tag.type === type
          })
        })
      }
      return batches
    }
  }
}
