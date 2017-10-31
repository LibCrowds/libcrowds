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
import orderBy from 'lodash/orderBy'
import merge from 'lodash/merge'

export default {
  data () {
    return {
      defaultSearchParams: {
        limit: 20,
        all: 1
      }
    }
  },

  methods: {
    /**
     * Handler to infinitely load domain objects.
     * @param {Object} $state
     *   The vue-inifinite-loading state.
     */
    async infiniteLoadDomainObjects ($state) {
      const params = {}
      merge(params, this.defaultSearchParams, this.searchParams, {
        offset: this.value.length
      })

      if (this.domainObject === 'project') {
        this.infiniteLoadOrderedProjects($state, params)
        return
      }

      try {
        // Get the data
        let data = await this.$axios.$get(`/api/${this.domainObject}`, {
          params: params
        })

        // Loading complete
        if (!data.length) {
          $state.complete()
          return
        }

        this.$emit('input', this.value.concat(data))
        $state.loaded()
      } catch (err) {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      }
    },

    /**
     * Handler to infinitely load projects.
     *
     * We have to deal with ordered projects slightly differently from other
     * domain objects as the project stats are stored in a different table. So,
     * we request all filtered projects and then sort. Not as efficient but it
     * is a solution for now.
     * @param {Object} $state
     *   The vue-inifinite-loading state.
     * @param {Object} params
     *   The query params.
     */
    async infiniteLoadOrderedProjects ($state, params) {
      params.limit = 100

      // Pull out order params
      const orderby = params.orderby || 'created'
      const order = params.desc ? 'desc' : 'asc'
      delete params.orderby
      delete params.desc

      let items = []

      // Load all items
      while (true) {
        try {
          const data = await this.$axios.$get(`/api/${this.domainObject}`, {
            params: merge(params, {
              offset: items.length ? items[items.length - 1].id : 0
            })
          })

          if (!data.length) {
            break
          }

          const statsData = await this.$axios.$get('/api/projectstats', {
            params: {
              project_id: data.map(project => project.id).toString()
            }
          })

          const enrichedData = data.map((project, idx) => {
            return merge(statsData[idx], project)
          })

          items = items.concat(enrichedData)
        } catch (err) {
          this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
          break
        }
      }

      // Sort
      const sorted = orderBy(items, [ orderby ], [ order ])

      this.$emit('input', sorted)
      if (sorted.length) {
        $state.loaded()
      }
      $state.complete()
    },

    /**
     * Reset the loaded domain objects.
     */
    reset () {
      this.$nextTick(() => {
        this.$emit('input', [])
        this.$refs.infiniteload.$emit('$InfiniteLoading:reset')
        this.$refs.infiniteload.$emit(
          '$InfiniteLoading:infinite',
          this.$refs.stateChanger
        )
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
