<template>
  <b-table
    class="project-contribute-table"
    hover
    striped
    responsive
    show-empty
    :items="projects"
    :fields="fields"
    empty-text="No projects are available for this category">
    <template slot="overall_progress" scope="project">
      {{ project.item.overall_progress }}%
    </template>
    <template slot="actions" scope="project">
      <project-contrib-button
        :shortname="project.item.short_name"
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
        actions: { label: 'Actions' }
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
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.project-contribute-table {
    .table {
    font-size: $font-size-sm;
    margin-bottom: 0;
    background-color: $white;
    border: $table-border-width solid $table-border-color;

    th {
      font-weight: 400;
      text-transform: uppercase;
      color: $text-muted;
      border-top: none;
    }

    tr *:not(:first-child) {
      text-align: center;
    }
  }
}
</style>
