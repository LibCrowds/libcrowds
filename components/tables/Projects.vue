<template>
  <div class="projects-table">
    <b-table
      hover
      striped
      show-empty
      :items="projects"
      :fields="tableFields">
      <template slot="created" scope="project">
        {{ project.item.created | moment('calendar') }}
      </template>
      <template slot="overall_progress" scope="project">
        {{ project.item.overall_progress }}%
      </template>
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
      projects: [],
      tableFields: {
        name: {
          label: 'Name'
        },
        n_volunteers: {
          label: 'Volunteers',
          class: 'text-center d-none d-lg-table-cell',
          sortable: true
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-lg-table-cell',
          sortable: true
        },
        n_tasks: {
          label: 'Tasks',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        },
        overall_progress: {
          label: 'Progress',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
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
      default: () => ({})
    },
    successBtn: {
      type: String,
      default: ''
    }
  },

  methods: {
    async infiniteLoadHandler ($state) {
      // Merge search params with defaults and last ID
      let lastId = 0
      if (this.projects.length) {
        lastId = this.projects[this.projects.length - 1].id
      }
      const params = merge(this.defaultParams, this.searchParams, {
        last_id: lastId
      })

      try {
        // Get project data
        const projectData = await this.$axios.$get('/api/project', {
          params: params
        })

        // Loading complete
        if (!projectData.length) {
          $state.complete()
          return
        }

        // Enrich projects with stats
        const statsData = await this.$axios.$get('/api/projectstats', {
          project_id: projectData.map(project => project.id)
        })
        const enrichedProjects = projectData.map((project, idx) => {
          return merge(statsData[idx], project)
        })

        this.projects = this.projects.concat(enrichedProjects)
        $state.loaded()
      } catch (err) {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      }
    }
  }
}
</script>
