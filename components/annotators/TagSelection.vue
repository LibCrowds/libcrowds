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
      container: null,
      containerBase: {
        creator: `${libcrowdsHost}/api/category/${this.collection.id}`,
        motivation: 'tagging',
      }
    }
  },

  props: {
    collection: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Create a container for the collection's tags.
     */
    async createContainer () {
      const endpoint = `${localConfig.tagsServer}/annotations`
      const libcrowdsHost = localConfig.libcrowdsHost
      const data = Object.assign({
        type: [
          'AnnotationCollection',
          'BasicContainer'
        ],
        label: `${this.collection.name} Tags`,
      }, this.containerBase)
      const headers = {
        'Slug': `${this.collection.short_name}-tags`
      }

      const container = await this.$axios.$post(endpoint, data, {
        headers: headers
      }).catch(err => {
        this.$nuxt.error(err)
      })

      return container
    },

    /**
     * Find a container for the collection's tags.
     */
    async findContainer () {
      const libcrowdsHost = localConfig.libcrowdsHost
      const endpoint = `${localConfig.tagsServer}/search/collection`
      const params = {
        contains: this.containerBase
      }
      const headers = {
        prefer: 'return=representation;' +
          'include="http://www.w3.org/ns/ldp#PreferMinimalContainer"'
      }
      const containers = await this.$axios.$get(endpoint, {
        params: params,
        headers: headers
      }).catch(err => {
        this.$nuxt.error(err)
      })

      if (containers && containers.contains.length) {
        return containers.contains[0]
      }

      return this.createContainer()
    },

    /**
     * Search for current tags.
     * @param {String} query
     *   The query string.
     */
    findTags (query) {
      const libcrowdsHost = localConfig.libcrowdsHost
      const endpoint = `${localConfig.tagsServer}/search/annotation`

      this.tagSearchLoading = true

      if (!this.container) {
        this.container = this.findContainer()
      }

      const libcrowdsHost = localConfig.libcrowdsHost
      const endpoint = `${localConfig.tagsServer}/search/annotation`
      const params = {
        contains: {
          creator: this.creator
        }
      }
      const headers = {
        prefer: 'return=representation;' +
          'include="http://www.w3.org/ns/ldp#PreferMinimalContainer"'
      }
      const container = await this.$axios.$get(endpoint, {
        params: params,
        headers: headers
      }).catch(err => {
        this.$nuxt.error(err)
      })

      this.tagSearchLoading = true
      this.endpoint = localConfig.tagsServer
      const catShortName = this.collection.short_name
      const endpoint = `/lc/categories/${catShortName}/tags`
      this.$axios.$get(endpoint, {
        params: {
          query: query
        }
      }).then(data => {
        this.foundTags = data.tags
        this.tagSearchLoading = false
      })
    },

    /**
     * Get the label to display for a tag.
     * @param {Object} tag
     *   The tag.
     */
    getTagLabel (tag) {
      return tag['body']['value']
    },

    /**
     * Add a new tag.
     * @param {String} value
     *   The tag value.
     */
    addTag (value) {
      const catShortName = this.currentCollection.short_name
      const endpoint = `/lc/categories/${catShortName}/tags/add`
      const type = this.task.info.hasOwnProperty('tileSource')
        ? 'iiif'
        : 'image'
      const target = this.task.info.hasOwnProperty('tileSource')
        ? this.task.info.tileSource
        : this.task.info.url

      this.$axios.$post(endpoint, {
        value: value,
        target: target,
        type: type
      }).then(data => {
        this.$notifications.flash(data)
        if (data.tag) {
          this.selectedTags.push(data.tag)
        }
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
      const catShortName = this.currentCollection.short_name
      const endpoint = `/lc/categories/${catShortName}/tags/add`
      const type = this.task.info.hasOwnProperty('tileSource')
        ? 'iiif'
        : 'image'
      const target = this.task.info.hasOwnProperty('tileSource')
        ? this.task.info.tileSource
        : this.task.info.url

      this.$axios.$post(endpoint, {
        value: tag['body']['value'],
        target: target,
        type: type
      }).then(data => {
        this.$notifications.flash(data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    },

    /**
     * Remove a tag.
     * @param {Object} tag
     *   The tag.
     */
    removeTag (tag) {
      const catShortName = this.currentCollection.short_name
      const endpoint = `/lc/categories/${catShortName}/tags/remove`
      const type = this.task.info.hasOwnProperty('tileSource')
        ? 'iiif'
        : 'image'
      const target = this.task.info.hasOwnProperty('tileSource')
        ? this.task.info.tileSource
        : this.task.info.url

      this.$axios.$post(endpoint, {
        value: tag['body']['value'],
        target: target,
        type: type
      }).then(data => {
        this.$notifications.flash(data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  },

  mounted () {
    this.validateTemplate()
    this.loadTask()
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', [])
  }
}
</script>
