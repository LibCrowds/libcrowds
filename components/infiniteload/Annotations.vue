<template>
  <no-ssr>
    <infinite-loading
      ref="infiniteload"
      class="infinite-loading"
      @infinite="infiniteLoadAnnotations"
    >
      <span slot="no-results">
        <span v-if="noResults">{{ noResults }}</span>
      </span>
      <span slot="no-more">
        <span v-if="noMoreResults">{{ noMoreResults }}</span>
      </span>
    </infinite-loading>
  </no-ssr>
</template>

<script>
import uniqBy from 'lodash/uniqBy'
import Fuse from 'fuse.js'

export default {
  data () {
    return {
      items: [],
      offset: 0
    }
  },

  props: {
    value: {
      type: Array,
      required: true
    },
    containerIri: {
      type: String,
      required: true
    },
    noResults: {
      type: String,
      default: 'No results'
    },
    noMoreResults: {
      type: String,
      default: 'No more results'
    },
    searchString: {
      type: String,
      default: ''
    },
    searchKeys: {
      type: Array,
      default: () => ([])
    }
  },

  methods: {
    /**
     * Handler to infinitely load Annotations.
     * @param {Object} $state
     *   The vue-inifinite-loading state.
     */
    async infiniteLoadAnnotations ($state) {
      let response = null
      const limit = 20
      // const limit = 100
      try {
        response = await this.$explicates.search({
        // response = await this.$explicates.suggestTags({
          collection: this.containerIri,
          limit: limit,
          offset: this.offset
        })
      } catch (err) {
        this.$nuxt.error(err)
      }

      if (response.data.hasOwnProperty('first')) {
        this.items = uniqBy(this.items.concat(response.data.first.items), 'id')
        // this.items = this.items.concat(response.data.first.items)
        this.offset += response.data.first.items.length
      }

      if (
        !response.data.hasOwnProperty('first') ||
        response.data.first.items.length < limit
      ) {
        $state.complete()
        this.$emit('complete')
        return
      }

      $state.loaded()
    },

    /**
     * Apply fuzzy search.
     * @param {Array} items
     *   The items to search.
     */
    search (items) {
      if (
        this.searchKeys &&
        this.searchString &&
        this.searchKeys.length &&
        this.searchString.length
      ) {
        return this.fuse.search(this.searchString)
      }
      return items
    },

    /**
     * Reset the loaded items.
     */
    reset () {
      this.$emit('input', [])
      this.$nextTick(() => {
        this.page = 0
        this.$refs.infiniteload.$emit('$InfiniteLoading:reset')
      })
    },

    /**
     * Trigger a manual load.
     */
    load () {
      this.$nextTick(() => {
        if (!this.$refs.infiniteload.isLoading) {
          this.$refs.infiniteload.attemptLoad()
        }
      })
    },

    /**
     * Emit the loaded and possibly filtered items.
     */
    emitItems () {
      const filteredItems = this.search(this.items)
      this.$emit('input', filteredItems)
    }
  },

  computed: {
    fuse () {
      return new Fuse(this.items, {
        shouldSort: true,
        tokenize: true,
        matchAllTokens: true,
        findAllMatches: true,
        threshold: 0,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: this.searchKeys
      })
    }
  },

  watch: {
    searchKeys () {
      this.emitItems()
    },
    searchString () {
      this.emitItems()
    },
    items () {
      this.emitItems()
    }
  }
}
</script>
