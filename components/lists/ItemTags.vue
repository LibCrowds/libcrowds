<template>
  <div class="badge-list">
    <p class="text-muted" v-if="message">
      {{ message }}
    </p>
    <b-badge
      v-else
      v-for="tag in tags"
      :key="tag.id"
      variant="primary">
      {{ tag.body.value }}
    </b-badge>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tags: [],
      message: 'Loading...'
    }
  },

  props: {
    containerIri: {
      type: String,
      required: true
    },
    sourceIri: {
      type: String,
      required: true
    },
    scopeIri: {
      type: String,
      required: true
    }
  },

  methods: {
    /**
     * Load the item's tags.
     */
    async loadTags () {
      this.message = 'Loading...'
      this.tags = []

      return this.$explicates.search({
        collection: containerIri,
        contains: {
          target: this.getTarget()
        }
      }).then(r => {
        if (r.data.total > 0) {
          this.message = ''
          this.tags = r.data.first.items
        } else {
          this.message = 'None'
        }
      }).catch(err => {
        this.message = 'Failed to load tags'
        this.$notifications.flash({ status: 'error', message: err.message })
      })
    },

    /**
     * Get the target of for searching purposes.
     */
    getTarget () {
      const source = this.sourceIri

      if (this.scopeIri && this.scopeIri.length) {
        return {
          source: source,
          scope: this.scopeIri
        }
      }

      return source
    }
  },

  mounted () {
    this.loadTags()
  },

  watch: {
    sourceIri () {
      this.loadTags()
    }
  }
}
</script>
