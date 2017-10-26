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
      this.$emit('input', [])
      this.$nextTick(() => {
        this.$refs.loading.$emit('$InfiniteLoading:reset')
      })
    },

    /**
     * Start the load manually (useful when modal first shown etc.).
     */
    initLoad () {
      if (!this.$refs.infiniteload.isComplete) {
        this.$refs.infiniteload.attemptLoad()
      }
    }
  },

  props: {
    value: {
      type: Array,
      require: true
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
      default: null
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
    /**
     * Reset the list when the search params change.
     *
     * This is necessary as we may be retrieving items in a different order.
     */
    searchParams () {
      this.reset()
    }
  }
}
</script>

<style>

</style>