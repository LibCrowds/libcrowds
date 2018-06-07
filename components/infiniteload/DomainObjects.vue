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

      try {
        // Get the data
        let data = await this.$axios.$get(`/api/${this.domainObject}`, {
          params: params
        })

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

        this.$emit('input', this.value.concat(data))
        $state.loaded()
      } catch (err) {
        this.$nuxt.error(err)
      }
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
