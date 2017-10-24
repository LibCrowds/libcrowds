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
import infinitelyLoadProjects from '@/mixins/methods/infinitelyLoadProjects'

export default {

  mixins: [ infinitelyLoadProjects ],

  data () {
    return {
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
  }
}
</script>
