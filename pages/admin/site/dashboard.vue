<template>
  <div id="admin-dashboard">
    <line-chart
      class="mt-3"
      header="New users"
      unit="user"
      :chart-data="newUsers">
    </line-chart>

    <line-chart
      class="mt-3"
      header="Returning Users"
      unit="user"
      :chart-data="returningUsers">
    </line-chart>
  </div>
</template>

<script>
import LineChart from '@/components/charts/Line'

export default {
  layout: 'admin-site-dashboard',

  middleware: 'is-admin',

  data () {
    return {
      title: 'Dashboard'
    }
  },

  async asyncData ({ app, error }) {
    return app.$axios.$get('/admin/dashboard').then(data => {
      return {
        activeAnon: data.active_anon_last_week,
        activeUsers: data.active_users_last_week,
        returningUsers: data.returning_users_week,
        newUsers: data.new_users_week,
        newTaskRuns: data.new_task_runs_week,
        newTasks: data.new_tasks_week,
        updateFeed: data.update_feed,
        draftProjects: data.draft_projects_last_week,
        publishedProjects: data.published_projects_last_week,
        updatedProjects: data.update_projects_last_week
      }
    }).catch(err => {
      error(err)
    })
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    LineChart
  }
}
</script>
