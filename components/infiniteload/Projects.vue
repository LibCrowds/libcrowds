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
import isEmpty from 'lodash/isEmpty'
import filter from 'async/filter'

export default {
  data () {
    return {
      page: 1
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
    },
    hasNewTask: {
      type: Boolean,
      default: false
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
      let data = {}

      if (this.orderby) {
        params.orderby = this.orderby
      }

      // Only include if true
      if (this.desc) {
        params.desc = this.desc
      }

      let endpoint = `/project/category/${this.collection.short_name}`
      if (this.page > 1) {
        endpoint += `/page/${this.page}`
      }

      try {
        data = await this.$axios.$get(endpoint, { params: params })
      } catch (err) {
        this.$nuxt.error(err)
      }
      this.page += 1

      if (!data.projects.length) {
        $state.complete()
        this.$emit('complete')
        return
      }

      if (!this.hasNewTask) {
        $state.loaded()
        this.$emit('input', this.value.concat(data.projects))
        return
      }

      // Check each project to see if we can get a task for the current user.
      // Not the most efficient as we have to make an additional call for
      // each project. We might see if we can update the PYBOSSA API at some
      // point to accomodate the kinds of joint requests we need here, but this
      // will do for now!
      filter(data.projects, (p, callback) => {
        this.$axios.$get(`/api/project/${p.id}/newtask`).then(data => {
          callback(null, (
            !isEmpty(data) &&
            !data.info.hasOwnProperty('error')
          ))
        }).catch(err => {
          this.$nuxt.error(err)
        })
      }, (_err, projectsWithNewTasks) => {
        $state.loaded()
        this.$emit('input', this.value.concat(projectsWithNewTasks))
      })
    },

    /**
     * Reset the loaded items.
     *
     * If the items are displayed using a transition the wait paramter should
     * be used with a time longer than that transition to ensure the the reload
     * is triggered, otherwise we might not be at the scroll distance when the
     * reset happens.
     * @param {Number} wait
     *   A number of milliseconds to wait before reloading.
     */
    reset (wait = 0) {
      this.$emit('input', [])
      this.$nextTick(() => {
        setTimeout(() => {
          this.page = 1
          this.$refs.infiniteload.$emit('$InfiniteLoading:reset')
        }, wait)
      })
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
