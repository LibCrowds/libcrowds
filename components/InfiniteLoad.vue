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
        this.$nuxt.error(err)
      }
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
