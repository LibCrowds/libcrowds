<template>
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
</template>

<script>
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
      if (this.domainObject === 'project') {
        this.infiniteLoadProjects()
        return
      }

      // Merge search params with defaults and last ID
      const params = merge(this.defaultSearchParams, this.searchParams, {
        last_id: this.lastId
      })

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
     * We have to deal with projects slightly differently from other domain
     * objects as the project stats are stored in a different table and we
     * might want to filter by an attribute in the project table and order by
     * an attribute in the stats table. So, we'll use the
     * /project/category/<short_name>/ endpoint (where the stats are merged),
     * orderby and then filter.
     * @param {Object} $state
     *   The vue-inifinite-loading state.
     */
    async infiniteLoadProjects ($state) {
      const endpoint = `/project/category/${this.collection.short_name}`

      try {
        let data = await this.$axios.$get(endpoint)

        // Loading complete
        if (!data.length) {
          $state.complete()
          return
        }

        // Enrich projects data with stats
        if (this.domainObject === 'project') {
          const statsData = await this.$axios.$get('/api/projectstats', {
            project_id: data.map(project => project.id)
          })
          data = data.map((project, idx) => {
            return merge(statsData[idx], project)
          })
        }

        this.$emit('input', this.value.concat(data))
        $state.loaded()
      } catch (err) {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      }
    },

    /**
     * Reset the loaded domain objects.
     */
    reset () {
      this.$nextTick(() => {
        this.$emit('input', [])
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

  computed: {
    lastId () {
      let lastId = 0
      if (this.value.length) {
        lastId = this.value[this.value.length - 1].id
      }
      return lastId
    }
  },

  watch: {
    'searchParams': {
      handler: function (val, oldVal) {
        this.reset()
        this.initLoad()
      },
      deep: true
    },
    'searchParams.info': {
      handler: function (val, oldVal) {
        this.reset()
        this.initLoad()
      },
      deep: true
    }
  }
}
</script>
