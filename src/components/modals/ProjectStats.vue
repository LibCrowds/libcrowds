<template>
  <b-modal
    :id="modalId"
    title="Project Stats"
    size="lg"
    @shown="fetchData">

    <div class="p-2">
      <p
        v-if="project.overall_progress == 0"
        class="lead mb-0">
        Sorry, not enough tasks have been completed to generate statistics
        for this project.
      </p>

      <loading
        v-else-if="loading"
        text="Loading statistics">
      </loading>

      <span v-else>
        <p class="lead d-flex">
          <icon name="clock-o" scale="2" class="mr-1"></icon>
          Average contribution time:
          <strong class="ml-1">{{ avgContribTime }} seconds</strong>
        </p>

        <proportion-auth-users-chart
          v-if="userStats.authenticated && userStats.anonymous"
          :n-anon="userStats.anonymous.taskruns"
          :n-auth="userStats.authenticated.taskruns">
        </proportion-auth-users-chart>

        <bar-chart v-if="userStats.top5" :data="userStats.top5"></bar-chart>
      </span>
    </div>

  </b-modal>
</template>

<script>
import 'vue-awesome/icons/clock-o'
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'
import BarChart from '@/components/charts/BarChart'
import ProportionAuthUsersChart from '@/components/charts/ProportionAuthUsers'

export default {
  data: function () {
    return {
      loading: true,
      avgContribTime: 0,
      userStats: {}
    }
  },

  components: {
    Loading,
    BarChart,
    ProportionAuthUsersChart
  },

  props: {
    modalId: {
      type: String,
      required: true
    },
    project: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Fetch the stats.
     */
    fetchData () {
      pybossaApi.get(`/project/${this.project.short_name}/stats`).then(r => {
        this.loading = false
        console.log(r.data)
        this.avgContribTime = r.data.avg_contrib_time
        this.userStats = r.data.userStats || {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
