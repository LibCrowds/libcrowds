<template>
  <b-modal
    lazy
    :id="modalId"
    ok-only
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

      <pie-chart
        v-if="userStats.authenticated && userStats.anonymous"
        :chart-data="proportionAuthData"
        :header="proportionAuthHeader">
      </pie-chart>

      <line-chart
        v-if="projectStats.dayStats"
        class="mt-3"
        :header="dailyContributionsHeader"
        :unit="collection.info.terminology.taskrun"
        :chart-data="dailyContributionsData">
      </line-chart>

      <line-chart
        v-if="projectStats.hourStats"
        class="mt-3"
        :header="hourlyContributionsHeader"
        :unit="collection.info.terminology.taskrun"
        :chart-data="hourlyContributionsData">
      </line-chart>

      <bar-chart
        v-if="userStats.authenticated"
        class="mt-3"
        header="Top authenticated users over the past 2 weeks"
        :unit="collection.info.terminology.taskrun"
        :chart-data="topUsersData">
      </bar-chart>

    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import pluralize from 'pluralize'
import 'vue-awesome/icons/clock-o'
import LineChart from '@/components/charts/Line'
import BarChart from '@/components/charts/Bar'
import PieChart from '@/components/charts/Pie'

export default {
  data: function () {
    return {
      userStats: {},
      projectStats: {}
    }
  },

  components: {
    LineChart,
    BarChart,
    PieChart
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
    collection: {
      type: Object,
      required: true
    }
  },

  methods: {
    /**
     * Fetch the stats.
     */
    fetchData () {
      this.$axios.$get(`/project/${this.project.short_name}/stats`, {
        params: {
          short_name: this.project.short_name
        }
      }).then(data => {
        this.userStats = data.userStats || {}
        this.projectStats = data.projectStats || {}
        if (this.$ga) {
          this.$ga.event({
            eventCategory: 'Statistics',
            eventAction: 'view',
            eventLabel: this.project.name,
            eventValue: 1
          })
        }
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    dailyContributionsData () {
      return {
        labels: this.projectStats.dayStats[0].values.map(value => {
          return moment(new Date(value[0])).format('DD MMM')
        }),
        series: [
          this.projectStats.dayStats[0].values.map(value => value[1])
        ]
      }
    },

    hourlyContributionsData () {
      let d = {
        labels: this.projectStats.hourStats[0].values.map(value => value[0]),
        series: [
          this.projectStats.hourStats[0].values.map(value => value[1])
        ]
      }
      return d
    },

    topUsersData () {
      return {
        labels: this.userStats.authenticated.top5.map(stat => stat.name),
        series: [
          this.userStats.authenticated.top5.map(stat => stat.tasks)
        ]
      }
    },

    proportionAuthData () {
      return {
        labels: [
          'Authenticated Volunteers',
          'Anonymous Volunteers'
        ],
        series: [
          {
            meta: 'Authenticated Volunteers:',
            value: this.userStats.anonymous.taskruns
          },
          {
            meta: 'Anonymous Volunteers:',
            value: this.userStats.authenticated.taskruns
          }
        ]
      }
    },

    dailyContributionsHeader () {
      const taskrun = pluralize(this.collection.info.terminology.taskrun)
      return `Daily ${taskrun} over the past 2 weeks`
    },

    hourlyContributionsHeader () {
      const taskrun = pluralize(this.collection.info.terminology.taskrun)
      return `Hourly ${taskrun} over the past 2 weeks`
    },

    proportionAuthHeader () {
      return 'Proportion of authenticated users over the past 2 weeks'
    }
  }
}
</script>
