<template>
  <b-table
    class="project-contribute-table"
    hover
    striped
    show-empty
    :items="projects"
    :fields="fields"
    empty-text="No projects are available for this category">
    <template slot="overall_progress" scope="project">
      {{ project.item.overall_progress }}%
    </template>
    <template slot="action" scope="project">

      <project-contrib-button
        :shortname="project.item.short_name"
        v-if="action === 'contribute'"
        size="sm">
      </project-contrib-button>

    </template>
  </b-table>
</template>

<script>
import ProjectContribButton from '@/components/buttons/ProjectContrib'

export default {
  data: function () {
    return {
      fields: {
        name: { label: 'Name' },
        n_tasks: { label: 'Tasks' },
        n_volunteers: { label: 'Volunteers' },
        overall_progress: { label: 'Progress' },
        action: { label: 'Action' }
      }
    }
  },

  components: {
    ProjectContribButton
  },

  props: {
    projects: {
      type: Array,
      required: true
    },
    action: {
      type: String,
      required: true,
      validator: value => {
        return value in ['contribute', 'download', 'open']
      }
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

.project-contribute-table {
  tr {
    *:not(:first-child) {
      text-align: center;
    }
  }
}
</style>
