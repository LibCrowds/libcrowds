<template>
  <multiselect
    v-model="selectedTags"
    id="ajax"
    label="name"
    track-by="id"
    placeholder="Type to search"
    open-direction="bottom"
    :options="foundTags"
    :multiple="true"
    :searchable="true"
    :loading="tagsLoading"
    :internal-search="false"
    :limit="10"
    :show-no-results="false"
    :hide-selected="true"
    :custom-label="getTagLabel"
    :taggable="true"
    @tag="addTag"
    @select="selectTag"
    @remove="removeTag"
    @search-change="findTags">
  </multiselect>
</template>

<script>
export default {
  data () {
    return {
      tagsLoading: false,
      foundTags: [],
      selectedTags: [],
      container: null
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
      default: ''
    }
  },

  methods: {
    /**
     * Search for current tags.
     * @param {String} query
     *   The query string.
     */
    async findTags (query) {
      if (!query.length) {
        return
      }

      const safeQuery = query.replace(/[^\w\s&]/gi, '')
      const idParts = this.containerIri.split('/')
      const containerId = idParts[idParts.length - 2]

      return this.$explicates.searchAnnotations({
        fts: `body::${safeQuery}:*`,
        'collection.id': containerId
      }).then(r => {
        if (r.data.total > 0) {
          this.foundTags = r.data.first.items
        }
        this.tagsLoading = false
      }).catch(err => {
        this.handleError(err)
      })
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
     * Get the target of the current item.
     */
    getTarget () {
      const source = {
        id: this.sourceIri,
        type: this.type
      }

      if (this.scopeIri && this.scopeIri.length) {
        return {
          source: source,
          scope: this.scopeIri
        }
      }

      return source
    },

    /**
     * Add a new tag.
     * @param {String} value
     *   The tag value.
     */
    addTag (value) {
      const newTag = {
        motivation: 'tagging',
        type: 'Annotation',
        body: {
          type: 'TextualBody',
          value: value,
          format: 'text/plain'
        },
        target: [this.getTarget()]
      }

      this.tagsLoading = true
      return this.$explicates.createAnnotation(this.containerIri, newTag).then(r => {
        this.$notifications.success({ message: 'Tag added' })
        this.selectedTags.push(r.data)
        this.tagsLoading = false
      }).catch(err => {
        this.handleError(err)
      })
    },

    /**
     * Select a tag.
     * @param {Object} tag
     *   The tag.
     */
    selectTag (tag) {
      const newTarget = this.getTarget()
      tag.target.push(newTarget)
      this.updateTag(tag).then(() => {
        this.$notifications.success({ message: 'Tag selected' })
      })
    },

    /**
     * Remove a tag.
     * @param {Object} tag
     *   The tag.
     */
    removeTag (tag) {
      const oldTarget = this.getTarget()
      tag.target.filter(t => {
        if (t.hasOwnProperty('scope') && oldTarget.hasOwnProperty('scope')) {
          return t.scope.id !== oldTarget.scope.id
        }
        return t.id !== oldTarget.id
      })
      this.updateTag(tag).then(() => {
        this.$notifications.success({ message: 'Tag removed' })
      })
    },

    /**
     * Update a tag.
     * @param {Object} tag
     *   The tag.
     */
    updateTag (tag) {
      return this.$explicates.updateAnnotation(tag.id, tag).catch(err => {
        this.handleError(err)
      })
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
      const errorMessage = `Oh no, our tagging system seems to be broken.
        Sorry about that, we'll get it fixed as soon as possible. You can
        still continue using the result of the application as normal.`
      this.tagsLoading = false
      this.$emit('error', err)
      console.error(err)
      this.$notifications.error({ message: errorMessage })
    }
  }
}
</script>
