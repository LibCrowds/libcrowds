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
import localConfig from '@/local.config'

export default {
  data () {
    return {
      tagsLoading: false,
      foundTags: [],
      selectedTags: [],
      container: null,
      errorMessage: `Oh no, our tagging system seems to be broken. Sorry about
        that, we'll get it fixed as soon as possible. You can still continue
        using the result of the application as normal.`
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
      let response = null

      try {
        response = await this.$explicates.searchCollections({
          contains: {
            creator: data.creator,
            motivation: data.motivation
          }
        })
      } catch (err) {
        this.$notifications.error({ message: this.errorMessage })
        return
      }

      if (response.data.total > 0) {
        return response.data.first.items[0]
      }

      const slug = `${this.collection.short_name}-tags`
      try {
        response = await this.$explicates.createCollection(data, slug)
      } catch (err) {
        this.$notifications.error({ message: this.errorMessage })
        return
      }
      return response.data
    },

    /**
     * Search for current tags.
     * @param {String} query
     *   The query string.
     */
    async findTags (query) {
      if (!this.container) {
        this.container = await this.getContainer()
      }

      if (!query || !query.length) {
        return
      }

      const idParts = this.container.id.split('/')
      const containerId = idParts[idParts.length - 2]

      return this.$explicates.searchAnnotations({
        fts: `body::${query}:*`,
        'collection.id': containerId
      }).then(r => {
        if (r.data.total > 0) {
          this.foundTags = r.data.first.items
        }
        this.tagsLoading = false
      }).catch(err => {
        console.log(err)
        this.$notifications.error({ message: this.errorMessage })
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

      if (this.manifestUri && this.manifestUri.length) {
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
      return this.$explicates.createAnnotation(this.container.id, newTag).then(r => {
        this.$notifications.success({ message: 'Tag added' })
        this.selectedTags.push(r.data)
        this.tagsLoading = false
      }).catch(err => {
        console.log(err)
        this.$notifications.error({ message: this.errorMessage })
        this.tagsLoading = false
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
        console.log(err)
        this.$notifications.error({ message: this.errorMessage })
      })
    }
  }
}
</script>
