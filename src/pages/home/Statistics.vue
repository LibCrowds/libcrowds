<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="results">
      <h2 class="text-center">Statistics</h2>
      <hr>
      <h3 class="text-center">Most Active Volunteers</h3>
      <div id="top-users-chart" class="ct-major-seventh"></div>
    </section>

  </floating-tabs-layout>

</template>

<script>
import Chartist from 'chartist'
import pybossaApi from '@/api/pybossa'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      navItems: [
        { id: 'top-users-chart', text: 'Most Active Volunteers' }
      ],
      topUsers: []
    }
  },

  methods: {
    fetchGlobalStats () {
      pybossaApi.get('/stats/').then(r => {
      })
    },
    fetchTopUsers () {
      pybossaApi.get(`/`).then(r => {
        this.topUsers = r.data.top_users
      })
    }
  },

  watch: {
    topUsers: function () {
      const data = {
        labels: this.topUsers.map((u) => u.name),
        series: [
          this.topUsers.map((u) => u.score)
        ]
      }
      Chartist.Bar('#top-users-chart', data)
    }
  },

  metaInfo: {
    title: 'Statistics'
  },

  components: {
    FloatingTabsLayout
  },

  created () {
    this.fetchGlobalStats()
    this.fetchTopUsers()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars';
@import '~chartist/dist/scss/chartist';
@import "~leaflet/dist/leaflet.css";
</style>
