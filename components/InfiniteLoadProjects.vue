<template>
  <infinite-loading
    ref="infiniteload"
    class="infinite-loading"
    @infinite="infiniteLoadProjects">
    <span slot="no-results">
      <span v-if="noResults">{{ noResults }}</span>
    </span>
    <span slot="no-more">
      <span v-if="noMoreResults">{{ noMoreResults }}</span>
    </span>
  </infinite-loading>
</template>

<script>
import some from 'lodash/some'

export default {
  data () {
    return {
      defaultOrderBy: 'created',
      page: 1
    }
  },

  methods: {
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
      const params = JSON.parse(JSON.stringify(this.searchParams))
      let endpoint = `/project/category/${this.collection.short_name}`

      if (this.page > 1) {
        endpoint += `/page/${this.page}`
      }
      this.page += 1

      const sortParams = {
        orderby: params.orderby || this.defaultOrderBy,
        desc: params.desc || true
      }

      console.log(sortParams)

      delete params.orderby
      delete params.desc

      try {
        const data = await this.$axios.$get(endpoint, { params: sortParams })
        const projects = data.projects

        // Loading complete
        if (!projects.length) {
          $state.complete()
          return
        }

        const filtered = projects.filter(project => {
          return some([project], params)
        })

        this.$emit('input', this.value.concat(filtered))
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
        this.page = 1
        this.$emit('input', [])
        this.$refs.infiniteload.$emit('$InfiniteLoading:reset')
      })
    },

    /**
     * Start the load manually.
     *
     * Useful when modal first shown etc., or after a reset.
     */
    initLoad () {
      if (!this.$refs.infiniteload.isComplete) {
        this.$refs.infiniteload.isLoading = true
        this.$refs.infiniteload.$emit(
          'infinite',
          this.$refs.infiniteload.stateChanger
        )
      }
    }
  },

  props: {
    value: {
      type: Array,
      required: true
    },
    collection: {
      type: Object,
      required: true
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
