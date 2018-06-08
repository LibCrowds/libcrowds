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
import uniqBy from 'lodash/uniqBy'

export default {
  methods: {
    /**
     * Handler to infinitely load domain objects.
     * @param {Object} $state
     *   The vue-inifinite-loading state.
     */
    async infiniteLoadDomainObjects ($state) {
      const params = Object.assign({}, this.searchParams)
      params.offset = this.value.length
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

      // Load unique by ID, in case multiple loads were running asynchronously
      this.$emit('input', uniqBy(this.value.concat(data), 'id'))
      $state.loaded()
    },

    /**
     * Reset the loaded items.
     */
    reset () {
      this.$emit('input', [])
      this.$nextTick(() => {
        this.page = 1
        this.$refs.infiniteload.$emit('$InfiniteLoading:reset')
      })
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
    noResults: {
      type: String,
      default: 'No results'
    },
    noMoreResults: {
      type: String,
      default: 'No more results'
    }
  },

  watch: {
    'searchParams': {
      handler: function (val, oldVal) {
        this.reset()
      },
      deep: true
    }
  }
}
</script>
