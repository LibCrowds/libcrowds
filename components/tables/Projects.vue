<template>
  <div class="projects-table">
    <b-table
      hover
      striped
      show-empty
      :items="projects"
      :fields="tableFields">
      <template slot="action" scope="project">
        <b-btn
          v-if="successBtn"
          slot="btn-action"
          variant="success"
          size="sm"
          block
          @click="$emit('successclick', project.item)">
          {{ successBtn }}
        </b-btn>
      </template>
    </b-table>
    <infinite-loading
      @infinite="infiniteLoadHandler">
       <span slot="no-results"></span>
       <span slot="no-more">
         There are no more results to be loaded.
       </span>
    </infinite-loading>
  </div>
</template>

<script>
import merge from 'lodash/merge'

export default {
  data () {
    return {
      projects: [],
      tableFields: {
        name: {
          label: 'Name'
        },
        overall_progress: {
          label: 'Progress',
          class: 'text-center'
        },
        action: {
          label: 'Action',
          class: 'text-center'
        }
      },
      defaultParams: {
        limit: 20,
        published: true,
        all: 1
      }
    }
  },

  props: {
    searchParams: {
      type: Object,
      default: () => {}
    },
    successBtn: {
      type: String,
      default: ''
    }
  },

  computed: {
    lastId () {
      if (!this.projects.length) {
        return 0
      }
      return this.projects[this.projects.length - 1].id
    }
  },

  methods: {
    infiniteLoadHandler ($state) {
      const params = merge(this.defaultParams, this.searchParams, {
        last_id: this.lastId
      })
      this.$axios.$get('/api/project', { params: params }).then(data => {
        if (!data.length) {
          $state.complete()
          return
        }
        this.projects = this.projects.concat(data)
        $state.loaded()
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    }
  }
}
</script>
