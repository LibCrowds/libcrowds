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
    :loading="tagSearchLoading"
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
import localConfig from '@/local.config'

export default {
  data () {
    return {
      tagSearchLoading: false,
      foundTags: [],
      selectedTags: [],
      container: null
    }
  },

  props: {
    collection: {
      type: Object,
      required: true
    },
    sourceUri: {
      type: String,
      required: true
    },
    scopeUri: {
      type: String,
      default: ''
    }
  },

  methods: {
    /**
     * Return an AnnotationCollection for the collection's tags.
     *
     * Creates a new AnnotationCollection if an existing one is not found.
     */
    async getContainer () {
      const libcrowdsHost = localConfig.libcrowdsHost
      const data = {
        type: [
          'AnnotationCollection',
          'BasicContainer'
        ],
        creator: `${libcrowdsHost}/api/category/${this.collection.id}`,
        motivation: 'tagging',
        label: `${this.collection.name} Tags`
      }

      let searchResponse = await this.$explicates.searchCollections({
        contains: {
          creator: data.creator,
          motivation: data.motivation
        }
      })

      if (searchResponse.data.total > 0) {
        return searchResponse.data.first.items[0]
      }

      let createResponse = await this.$explicates.createCollection(data)
      return createResponse.data
    },

    /**
     * Search for current tags.
     * @param {String} query
     *   The query string.
     */
    findTags (query) {
      if (!this.container) {
        this.container = this.getContainer()
      }

      const idParts = this.container.id.split('/')
      const containerId = idParts[idParts.length - 1]

      return this.$explicates.searchAnnotations({
        fts: `body::${query}:*`,
        'collection.id': containerId
      }).then(r => {
        if (r.data.total > 0) {
          this.foundTags = r.data.first.items
        }
        this.tagSearchLoading = false
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
        id: this.sourceUri,
        type: 'Image'
      }

      if (this.manifestUri.length) {
        return {
          source: source,
          scope: this.manifestUri
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
      const target = this.getTarget()
      const newTag = {
        motivation: 'tagging',
        type: 'Annotation',
        body: {
          type: 'TextualBody',
          value: 'foo',
          format: 'text/plain'
        },
        target: [target]
      }

      return this.$explicates.createAnnotation(this.container.id, newTag).then(r => {
        this.$notifications.success({ message: 'Tag added' })
        this.selectedTags.push(r.data)
      }).catch(err => {
        this.$nuxt.error(err)
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
      this.updateTag(tag)
    },

    /**
     * Remove a tag.
     * @param {Object} tag
     *   The tag.
     */
    removeTag (tag) {
      const oldTarget = this.getTarget()
      tag.target.filter(t => t.scope.id !== oldTarget.scope.id)
      this.updateTag(tag)
    },

    /**
     * Update a tag.
     * @param {Object} tag
     *   The tag.
     */
    updateTag (tag) {
      return this.$explicates.updateAnnotation(tag.id, tag).then(r => {
        this.$notifications.success({ message: 'Tag updated' })
        this.selectedTags.push(r.data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
