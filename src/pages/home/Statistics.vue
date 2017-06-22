<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="statistics">
      <h2 class="text-center">Statistics</h2>
      <hr>

      <h3 class="text-center">Most Active Volunteers</h3>
      <div id="top-users-chart" class="ct-major-seventh"></div>

      <div v-if="locs.length">
        <hr>
        <h3 class="text-center">Locations of Anonymous Volunteers</h3>
        <div class="ct-major-seventh">
          <div id="locs-map" style="height: 200px"></div>
        </div>
      </div>

    </section>

  </floating-tabs-layout>

</template>

<script>
import L from 'leaflet'
import Chartist from 'chartist'
import config from '@/config'
import pybossaApi from '@/api/pybossa'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: config,
      navItems: [
        { id: 'top-users-chart', text: 'Most Active Volunteers' }
      ],
      topUsers: [],
      locs: []
    }
  },

  methods: {
    fetchGlobalStats () {
      pybossaApi.get('/stats/').then(r => {
        if (r.data.show_locs) {
          this.locs = r.data.locs
        }
        console.log(r)
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
    },
    locs: function () {
      const baseUrl = 'https://api.tiles.mapbox.com/v4'
      const token = config.mapboxToken
      const url = `${baseUrl}/{id}/{z}/{x}/{y}.png?access_token=${token}`
      const map = L.map('locs-map', { scrollWheelZoom: false, minZoom: 1 })
      map.fitWorld()
      map.setZoom(2)
      L.tileLayer(url, {
        attribution: `
          Map data:
          &copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a>
          &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>
          <strong><a href='https://www.mapbox.com/feedback/' target='_blank'>
          Improve this map</a></strong>
        `,
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: config.mapboxToken
      }).addTo(map)

      let markers = new L.MarkerClusterGroup()
      for (let l of this.locs) {
        if (l.loc !== null) {
          let lat = parseFloat(l.loc.latitude)
          let lng = parseFloat(l.loc.longitude)
          markers.addLayer(L.marker([lat, lng]))
        }
      }
      map.addLayer(markers)
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
    console.log(this.map)
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars';
@import '~chartist/dist/scss/chartist';
@import '~leaflet.markercluster/dist/MarkerCluster';
@import '~leaflet.markercluster/dist/MarkerCluster.Default';
</style>
