<template>
  <multiselect
    ref="multiselect"
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
    :show-no-results="false"
    :hide-selected="true"
    :custom-label="getTagLabel"
    :taggable="true"
    @tag="addTag"
    @select="selectTag"
    @remove="removeTag"
    @search-change="searchTags"
  ></multiselect>
</template>

<script>
import localConfig from '@/local.config'

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
     * Build a new tag.
     * @param {Object} value
     *   The proposed tag value.
     */
    getNewTag (value) {
      const creator = this.getCreator()
      const newTag = {
        motivation: 'tagging',
        type: 'Annotation',
        body: {
          type: 'TextualBody',
          value: value,
          format: 'text/plain'
        },
        target: this.getTarget()
      }

      if (creator !== null) {
        newTag.creator = creator
      }

      return newTag
    },

    /**
     * Search for current tags.
     * @param {String} query
     *   The query string.
     */
    searchTags (query) {
      if (!query || !query.length) {
        return
      }

      const parts = query.split(' ')

      if (parts.length > 1) {
        this.$refs.multiselect.search = parts[1]
        return this.addTag(parts[0])
      }

      return this.search(query).then(r => {
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
    search (query, strict = false, contains = null) {
      const safeQuery = query.replace(/[^\w\s&]/gi, '')
      return this.$explicates.search({
        collection: this.containerIri,
        fts: {
          body: {
            query: safeQuery
          }
        },
        contains: contains === null ? {} : contains
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
      const source = this.sourceIri

      if (this.scopeIri && this.scopeIri.length) {
        return {
          source: source,
          scope: this.scopeIri
        }
      }

      return source
    },

    /**
     * Get the current user details, if any.
     */
    getCreator () {
      const currentUser = this.$store.state.currentUser
      if (typeof currentUser.id === 'undefined') {
        return null
      }
      return {
        id: `${localConfig.libcrowdsHost}/api/user/${currentUser.id}`,
        type: 'Person',
        name: currentUser.fullname,
        nickname: currentUser.name
      }
    },

    /**
     * Check if a tag with the same target and body exists.
     * @param {Object} value
     *   The proposed tag value.
     */
    async checkTagExists (value) {
      let response = null
      try {
        response = await this.$explicates.search({
          contains: {
            body: {
              value: value
            },
            target: this.getTarget()
          }
        })
      } catch (err) {
        this.handleError(err)
      }
      return response.data.total > 0
    },

    /**
     * Add a new tag.
     * @param {String} value
     *   The tag value.
     * @param {String} id
     *   The multiselect item id
     *   (the explicates annotation id if user selected existing tag one)
     *   (if user pressed space or selected new tag => null/undefined)
     */
    async addTag (value, id) {
      const exists = await this.checkTagExists(value)

      if (id) {
        // we unselect that tag as we want to create a new one instead
        this.selectedTags.pop()
      }

      if (exists) {
        this.$notifications.info({ message: 'Tag already exists' })
        return
      }

      const iri = this.containerIri
      const newTag = this.getNewTag(value)
      this.tagsLoading = true
      return this.$explicates.createAnnotation(iri, newTag).then(r => {
        this.$notifications.success({ message: 'Tag added' })
        this.tagsLoading = false
        this.selectedTags.push(r.data)
      }).catch(err => {
        this.handleError(err)
      })
    },

    /**
     * Select a tag.
     * @param {Object} tag
     *   The tag.
     */
    selectTag (tag, id) {
      // create a new tag in the DB and select it
      this.addTag(tag.body.value, tag.id)
    },

    /**
     * Remove a tag.
     * @param {Object} tag
     *   The tag.
     */
    removeTag (tag) {
      if (!tag) {
        return
      }

      this.$explicates.deleteAnnotation(tag.id).then(() => {
        this.$notifications.success({ message: 'Tag removed' })
      }).catch(err => {
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
      const errorMessage = `Oh no, our tagging system seems to be broken.<br>
        Sorry about that, we'll get it fixed as soon as possible.<br><br>
        You can still continue using the result of the application as normal.`
      this.tagsLoading = false
      this.$emit('error', err)
      console.error(err)
      this.$notifications.error({ message: errorMessage })
    }
  }
}
</script>
