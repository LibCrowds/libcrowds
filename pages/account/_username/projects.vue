<template>
  <div id="account-projects">
    <b-container class="my-5">
      <b-card no-body header="Open Project">
        <projects-table
          :search-params="searchParams"
          success-btn="Open"
          @successclick="openProject">
        </projects-table>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import ProjectsTable from '@/components/tables/Projects'

export default {
  layout: 'default',

  components: {
    ProjectsTable
  },

  computed: {
    searchParams () {
      const currentUser = this.$store.state.currentUser
      const params = {}
      if (!currentUser.admin) {
        params.owner_id = currentUser.id
      }
      return params
    }
  },

  methods: {
    /**
     * Redirect to a project settings page.
     * @param {Object} project
     *   The project.
     */
    openProject (project) {
      this.$router.push({
        name: 'project-shortname-settings',
        params: {
          shortname: project.short_name
        }
      })
    }
  }
}
</script>
