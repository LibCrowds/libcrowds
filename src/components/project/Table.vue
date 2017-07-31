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

      <data-download-button
        :project="project.item"
        else-if="action === 'download'"
        size="sm">
      </data-download-button>

    </template>
  </b-table>
</template>

<script>
import ProjectContribButton from '@/components/buttons/ProjectContrib'
import DataDownloadButton from '@/components/buttons/DataDownload'

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
    ProjectContribButton,
    DataDownloadButton
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
        const validActions = [
          'contribute',
          'download',
          'open'
        ]
        return validActions.indexOf(value) > -1
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
