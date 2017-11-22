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
        v-if="loading"
        class="lead mb-0">
        Loading stats...
      </p>

      <p
        v-else-if="project.overall_progress == 0"
        class="lead mb-0">
        Sorry, not enough tasks have been completed to generate statistics
        for this project.
      </p>

      <span v-else>
        <card-base
          title="Proportion of Authenticated Users"
          :description="proportionAuthDescription"
          class="mb-3">
          <b-card-body>
            <pie-chart
              v-if="userStats.authenticated && userStats.anonymous"
              :chart-data="proportionAuthData">
            </pie-chart>
          </b-card-body>
        </card-base>

        <card-base
          title="Daily Contributions"
          :description="dailyContributionsDescriptions"
          class="mb-3">
          <b-card-body>
            <line-chart
              v-if="projectStats.dayStats"
              :unit="collection.info.terminology.taskrun"
              :chart-data="dailyContributionsData">
            </line-chart>
          </b-card-body>
        </card-base>

        <card-base
          title="Hourly Contributions"
          :description="hourlyContributionsDescription"
          class="mb-3">
          <b-card-body>
            <line-chart
              v-if="projectStats.hourStats"
              :unit="collection.info.terminology.taskrun"
              :chart-data="hourlyContributionsData">
            </line-chart>
          </b-card-body>
        </card-base>

        <card-base
          title="Top Authenticated Users"
          :description="topUsersDescription"
          class="mb-3">
          <b-card-body>
            <bar-chart
              v-if="userStats.authenticated"
              :unit="collection.info.terminology.taskrun"
              :chart-data="topUsersData">
            </bar-chart>
          </b-card-body>
        </card-base>

      </span>
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
import CardBase from '@/components/cards/Base'

export default {
  data () {
    return {
      userStats: {},
      projectStats: {},
      loading: true
    }
  },

  components: {
    LineChart,
    BarChart,
    PieChart,
    CardBase
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
        this.loading = false
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

    dailyContributionsDescription () {
      const taskrun = pluralize(this.collection.info.terminology.taskrun)
      return `Daily ${taskrun} over the past two weeks`
    },

    hourlyContributionsDescription () {
      const taskrun = pluralize(this.collection.info.terminology.taskrun)
      return `Hourly ${taskrun} over the past two weeks`
    },

    proportionAuthDescription () {
      return `Proportion of authenticated users contributing over the past
        two weeks`
    },

    topUsersDescription () {
      return 'The users with the most contributions over the past two weeks'
    }
  }
}
</script>
