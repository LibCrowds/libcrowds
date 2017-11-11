<template>
  <no-ssr>
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
  </no-ssr>
</template>

<script>
export default {
  data () {
    return {
      page: 1
    }
  },

  methods: {
    /**
     * Handler to infinitely load projects for a collection.
     *
     * We have to deal with ordered projects slightly differently from other
     * domain objects as the project stats are stored in a different table.
     * @param {Object} $state
     *   The vue-inifinite-loading state.
     */
    async infiniteLoadProjects ($state) {
      const params = {}
      if (this.orderby) {
        params.orderby = this.orderby
      }

      // Only include if true
      if (this.desc) {
        params.desc = this.desc
      }

      let endpoint = `/project/category/${this.collection.short_name}`
      if (this.value.length) {
        this.page += 1
        endpoint += `/page/${this.page}`
      }

      try {
        let data = await this.$axios.$get(endpoint, { params: params })

        if (!data.projects.length) {
          $state.complete()
          return
        }

        this.$emit('input', this.value.concat(data.projects))
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
        this.page = 1
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
    collection: {
      type: Object,
      required: true
    },
    orderby: {
      type: String,
      default: null
    },
    desc: {
      type: Boolean,
      default: false
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
    orderby (val, oldVal) {
      this.reset()
    },
    desc (val, oldVal) {
      this.reset()
    }
  }
}
</script>
