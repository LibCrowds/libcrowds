<template>
  <multiselect
    v-model="selectedTags"
    track-by="id"
    placeholder="Type to search"
    open-direction="bottom"
    :options="foundTags"
    :multiple="true"
    :searchable="true"
    :loading="tagsLoading"
    :internal-search="false"
    :limit="10"
    :hide-selected="true"
    :custom-label="getTagLabel"
    no-result="No tags found, try changing the search query"
    @select="selectTag"
    @remove="removeTag"
    @search-change="searchTags">
  </multiselect>
</template>

<script>
export default {
  data () {
    return {
      tagsLoading: false,
      foundTags: [],
      selectedTags: []
    }
  },

  props: {
    containerIri: {
      type: String,
      required: true
    }
  },

  methods: {
    /**
     * Search for current tags.
     * @param {String} query
     *   The query string.
     */
    searchTags (query) {
      return this.searchAnnotations(query).then(r => {
        if (r.data.total > 0) {
          this.foundTags = r.data.first.items
        } else {
          this.foundTags = []
        }
        this.tagsLoading = false
      }).catch(err => {
        this.handleError(err)
      })
    },

    /**
     * Search for current tag Annotations.
     * @param {String} query
     *   The query string.
     * @param {Boolean} strict
     *   True to use the query as a prefix, false otherwise.
     */
    searchAnnotations (query, strict = false, contains = null) {
      const safeQuery = query.replace(/[^\w]/gi, '')
      const suffix = strict ? '' : ':*'
      const idParts = this.containerIri.split('/')
      const containerId = idParts[idParts.length - 2]
      const params = {
        'collection.id': containerId,
        contains: contains === null ? {} : contains
      }
      if (safeQuery.length) {
        params.fts = `body::${safeQuery}${suffix}`
      }
      return this.$explicates.searchAnnotations(params)
    },

    /**
     * Get the label to display for a tag.
     * @param {Object} tag
     *   The tag.
     */
    getTagLabel (tag) {
      return tag.body.value
    },

    /**
     * Handle an error.
     *
     * If the Annotation Server fails we probably just want to disable this
     * tagging function, so display a friendly error message and emit the
     * error event.
     * @param {Object} err
     *   The error.
     */
    handleError (err) {
      const errorMessage = `Oh no, our tagging system seems to be broken.<br>
        Sorry about that, we'll get it fixed as soon as possible.<br><br>
        You can still continue using the result of the application as normal.`
      this.tagsLoading = false
      this.$emit('error', err)
      console.error(err)
      this.$notifications.error({ message: errorMessage })
    },

    /**
     * Select a tag.
     *
     * The selected values are not actually up-to-date when the @select
     * event is emitted, so we have to add the selected tag first, then return.
     * @param {Object} tag
     *   The tag.
     */
    selectTag (tag) {
      const tagsClone = JSON.parse(JSON.stringify(this.selectedTags))
      tagsClone.push(tag)
      this.$emit('change', tagsClone)
    },

    /**
     * Select a tag.
     * @param {Object} tag
     *   The tag.
     */
    removeTag (tag) {
      this.$emit('change', this.selectedTags)
    }
  },

  mounted () {
    this.searchTags('') // Populate initial list
  }
}
</script>
