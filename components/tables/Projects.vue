<template>
  <div class="projects-table">
    <b-table
      hover
      striped
      show-empty
      :items="projects"
      :fields="tableFields"
      :style="cardStyle">

      <template slot="overall_progress" scope="project">
        {{ project.item.overall_progress }}%
      </template>

      <template slot="actions" scope="project">
        <slot name="action" :item="project.item"></slot>
      </template>

      <template slot="created" scope="project">
        {{ project.item.created | moment('calendar') }}
      </template>

    </b-table>

    <infinite-loading
      @infinite="infinitelyLoadProjects">
       <span slot="no-results"></span>
       <span slot="no-more">
         No more results
       </span>
    </infinite-loading>

  </div>
</template>

<script>
import { infinitelyLoadProjects } from '@/mixins/infinitelyLoadProjects'

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
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        },
        n_tasks: {
          label: 'Tasks',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        },
        overall_progress: {
          label: 'Progress',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        },
        actions: {
          label: 'Actions',
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
    noBorder: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    cardStyle () {
      if (this.noBorder) {
        return {
          border: 'none'
        }
      }
    }
  }
}
</script>
