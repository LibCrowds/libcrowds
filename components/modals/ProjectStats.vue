<template>
  <b-modal
    lazy
    :id="modalId"
    ok-only
    :header-text-variant="darkMode ? 'white' : null"
    :header-bg-variant="darkMode ? 'dark' : null"
    :body-bg-variant="darkMode ? 'dark' : null"
    :body-text-variant="darkMode ? 'white' : null"
    :footer-bg-variant="darkMode ? 'dark' : null"
    :footer-text-variant="darkMode ? 'white' : null"
    title="Project Stats"
    size="lg">

    <div class="p-2">
      <card-base
        v-for="(chart, index) in charts"
        v-if="chart.data"
        :key="index"
        :title="chart.title"
        :description="chart.description"
        class="mb-3 card-overflow">
        <b-card-body
          :bg-variant="darkMode ? 'dark' : null"
          :text-variant="darkMode ? 'white' : null">
          <component
            :is="chart.type"
            :chart-data="chart.data"
            :unit="chart.unit">
          </component>
        </b-card-body>
      </card-base>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import 'vue-awesome/icons/clock-o'
import LineChart from '@/components/charts/Line'
import BarChart from '@/components/charts/Bar'
import PieChart from '@/components/charts/Pie'
import CardBase from '@/components/cards/Base'

export default {
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

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    charts () {
      return [
        {
          title: 'Top Users',
          description: `Authenticated users with the most contributions over
            the past two weeks`,
          data: this.topUsersData,
          type: BarChart,
          unit: 'user'
        },
        {
          title: 'Daily Contributions',
          description: `Daily contributions over the past two weeks`,
          data: this.dailyContributionsData,
          type: LineChart,
          unit: 'contribution'
        },
        {
          title: 'Hourly Contributions',
          description: `Hourly contributions over the past two weeks`,
          data: this.hourlyContributionsData,
          type: LineChart,
          unit: 'contribution'
        },
        {
          title: 'Proportion Authenticated',
          description: `Proportion of authenticated users over the past two
            weeks`,
          data: this.proportionAuthData,
          type: PieChart,
          unit: 'user'
        }
      ]
    },

    dailyContributionsData () {
      const datesStats = this.project.stats.info.dates_stats
      if (typeof datesStats === 'undefined') {
        return null
      }
      return {
        labels: datesStats[0].values.map(value => {
          return moment(new Date(value[0])).format('DD MMM')
        }),
        series: [
          datesStats[0].values.map(value => value[1])
        ]
      }
    },

    hourlyContributionsData () {
      const hoursStats = this.project.stats.info.hours_stats
      if (typeof hoursStats === 'undefined') {
        return null
      }
      return {
        labels: hoursStats[0].values.map(value => value[0]),
        series: [
          hoursStats[0].values.map(value => value[1])
        ]
      }
    },

    topUsersData () {
      const usersStats = this.project.stats.info.users_stats
      if (typeof usersStats === 'undefined') {
        return null
      }
      return {
        labels: usersStats.auth.top5.map(stat => stat.name),
        series: [
          usersStats.auth.top5.map(stat => stat.tasks)
        ]
      }
    },

    proportionAuthData () {
      const usersStats = this.project.stats.info.users_stats
      if (typeof usersStats === 'undefined') {
        return null
      }
      return {
        labels: [
          'Authenticated Volunteers',
          'Anonymous Volunteers'
        ],
        series: [
          {
            meta: 'Authenticated Volunteers:',
            value: usersStats.n_anon
          },
          {
            meta: 'Anonymous Volunteers:',
            value: usersStats.n_auth
          }
        ]
      }
    }
  }
}
</script>
