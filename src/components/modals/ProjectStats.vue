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

        <single-line-chart
          v-if="projectStats.dayStats"
          class="mt-3"
          :header="dailyContributionsHeader"
          :unit="collectionConfig.terminology.taskRun"
          :data="dailyContributions">
        </single-line-chart>

        <single-line-chart
          v-if="projectStats.hourStats"
          class="mt-3"
          :header="hourlyContributionsHeader"
          :unit="collectionConfig.terminology.taskRun"
          :data="hourlyContributions">
        </single-line-chart>

        <bar-chart
          v-if="userStats.authenticated"
          class="mt-3"
          header="Top Authenticated Users"
          :unit="collectionConfig.terminology.taskRun"
          :data="topUsers">
        </bar-chart>

        <bar-chart v-if="userStats.top5" :data="userStats.top5"></bar-chart>
      </span>
    </div>

  </b-modal>
</template>

<script>
import pluralize from 'pluralize'
import 'vue-awesome/icons/clock-o'
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'
import formatDate from '@/utils/formatDate'
import BarChart from '@/components/charts/BarChart'
import ProportionAuthUsersChart from '@/components/charts/ProportionAuthUsers'
import SingleLineChart from '@/components/charts/SingleLineChart'

export default {
  data: function () {
    return {
      loading: true,
      avgContribTime: 0,
      userStats: {},
      projectStats: {}
    }
  },

  components: {
    Loading,
    BarChart,
    ProportionAuthUsersChart,
    SingleLineChart
  },

  props: {
    modalId: {
      type: String,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    collectionConfig: {
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
        this.projectStats = r.data.projectStats || {}
      })
    }
  },

  computed: {
    dailyContributions: function () {
      return {
        labels: this.projectStats.dayStats[0].values.map(value => {
          return formatDate(new Date(value[0]), 'DD MMM')
        }),
        series: [
          this.projectStats.dayStats[0].values.map(value => value[1])
        ]
      }
    },
    dailyContributionsHeader: function () {
      const start = pluralize(this.collectionConfig.terminology.taskRun)
      return `Daily ${start}`
    },
    hourlyContributions: function () {
      let d = {
        labels: this.projectStats.hourStats[0].values.map(value => value[0]),
        series: [
          this.projectStats.hourStats[0].values.map(value => value[1])
        ]
      }
      return d
    },
    hourlyContributionsHeader: function () {
      const start = pluralize(this.collectionConfig.terminology.taskRun)
      return `Hourly ${start}`
    },
    topUsers: function () {
      return {
        labels: this.userStats.authenticated.top5.map(stat => stat.name),
        series: [
          this.userStats.authenticated.top5.map(stat => stat.tasks)
        ]
      }
    }
  }
}
</script>
