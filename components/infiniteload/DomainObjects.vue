<template>
  <no-ssr>
    <infinite-loading
      ref="infiniteload"
      class="infinite-loading"
      @infinite="infiniteLoadDomainObjects">
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
import Fuse from 'fuse.js'
import uniqBy from 'lodash/uniqBy'

export default {
  data () {
    return {
      items: []
    }
  },

  props: {
    value: {
      type: Array,
      required: true
    },
    domainObject: {
      type: String,
      required: true,
      validator: (value) => {
        const valid = [
          'announcement',
          'auditlog',
          'blogpost',
          'category',
          'helpingmaterial',
          'project',
          'projectstats',
          'result',
          'task',
          'taskrun',
          'user',
          'webhook'
        ]
        return valid.indexOf(value) > -1
      }
    },
    searchParams: {
      type: Object,
      default: () => ({})
    },
    searchString: {
      type: String,
      default: ''
    },
    searchKeys: {
      type: Array,
      default: () => ([])
    },
    noResults: {
      type: String,
      default: 'No results'
    },
    noMoreResults: {
      type: String,
      default: 'No more results'
    }
  },

  methods: {
    /**
     * Handler to infinitely load domain objects.
     * @param {Object} $state
     *   The vue-inifinite-loading state.
     */
    async infiniteLoadDomainObjects ($state) {
      const params = Object.assign({}, this.searchParams)
      params.offset = this.items.length
      let data = null

      try {
        data = await this.$axios.$get(`/api/${this.domainObject}`, {
          params: params
        })
      } catch (err) {
        this.$nuxt.error(err)
      }

      // Loading complete
      if (!data.length) {
        $state.complete()
        this.$emit('complete')
        return
      }

      // Add the _showDetails flag
      data = data.map(item => {
        item._showDetails = false
        return item
      })

      // Get unique by ID, in case multiple loads were running asynchronously
      this.items = uniqBy(this.items.concat(data), 'id')
      $state.loaded()
    },

    /**
     * Reset the loaded items.
     */
    reset () {
      this.$emit('input', [])
      this.$nextTick(() => {
        this.items = []
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
    'searchParams': {
      handler: function (val, oldVal) {
        this.reset()
      },
      deep: true
    },
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
