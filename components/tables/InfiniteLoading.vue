<template>
  <div class="infinite-loading-table">
    <b-table
      hover
      striped
      show-empty
      :items="domainObjects"
      :fields="tableFields"
      :style="cardStyle"
      @sort-changed="reset">

      <template slot="overall_progress" scope="data">
        {{ data.item.overall_progress }}%
      </template>

      <template slot="created" scope="data">
        {{ data.item.created | moment('calendar') }}
      </template>

      <template slot="updated" scope="data">
        {{ data.item.updated | moment('calendar') }}
      </template>

      <template slot="last_activity" scope="data">
        {{ data.item.updated | moment('calendar') }}
      </template>

      <template slot="actions" scope="data">
        <slot name="action" :item="data.item"></slot>
      </template>

    </b-table>

    <infinite-loading
      ref="table"
      @infinite="infiniteLoadDomainObjects">
      <span slot="no-results"></span>
      <span slot="no-more" id="no-more">
        No more results
      </span>
    </infinite-loading>

  </div>
</template>

<script>
import merge from 'lodash/merge'

export default {
  data () {
    return {
      domainObjects: [],
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

        this.domainObjects = this.domainObjects.concat(data)
        $state.loaded()
      } catch (err) {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      }
    },

    /**
     * Reset the loaded domain objects.
     */
    reset () {
      this.domainObjects = []
      this.$nextTick(() => {
        this.$refs.table.$emit('$InfiniteLoading:reset')
      })
    }
  },

  props: {
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
    fields: {
      type: Object,
      required: true
    },
    noBorder: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    lastId () {
      let lastId = 0
      if (this.domainObjects.length) {
        lastId = this.domainObjects[this.domainObjects.length - 1].id
      }
      return lastId
    },

    cardStyle () {
      if (this.noBorder) {
        return {
          borderLeft: 'none',
          borderRight: 'none'
        }
      }
    },
    tableFields () {
      const fieldsCopy = JSON.parse(JSON.stringify(this.fields))
      if (this.$scopedSlots.action) {
        fieldsCopy.actions = {
          label: 'Actions',
          class: 'text-center'
        }
      }
      return fieldsCopy
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
