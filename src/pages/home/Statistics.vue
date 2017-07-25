<template>

  <floating-tabs-layout :nav-items="navItems">

    <section id="statistics">
      <h2 class="text-center">Statistics</h2>
      <hr>

      <div id="top-users">
        <h3 class="text-center">Most Active Volunteers</h3>
        <div id="top-users-chart" class="ct-major-seventh"></div>
      </div>

      <div :style="mapStyle">
        <hr>
        <h3 class="text-center">Locations of Anonymous Volunteers</h3>
        <div class="ct-major-seventh">
          <div id="locs-map"></div>
        </div>
      </div>

    </section>

  </floating-tabs-layout>

</template>

<script>
import L from 'leaflet'
import 'leaflet.markercluster'
import Chartist from 'chartist'
import 'chartist-plugin-tooltips'
import config from '@/config'
import pybossaApi from '@/api/pybossa'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'

export default {
  data: function () {
    return {
      config: config,
      navItems: [
        { id: 'top-users', text: 'Most Active Volunteers' },
        { id: 'top-users', text: 'Most Active Volunteers' }
      ],
      topUsers: [],
      locs: [],
      chartPlugins: [
        Chartist.plugins.tooltip()
      ]
    }
  },

  methods: {
    fetchGlobalStats () {
      pybossaApi.get('/stats/').then(r => {
        if (r.data.show_locs) {
          this.locs = r.data.locs
        }
      })
    },
    fetchTopUsers () {
      pybossaApi.get(`/`).then(r => {
        this.topUsers = r.data.top_users
      })
    },
    mapTileOpts: function () {
      if ('mapboxApiToken' in config) {
        return {
          maxZoom: 18,
          attribution: `
            Map data:
            &copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a>
            &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>
            <strong><a href='https://www.mapbox.com/feedback/' target='_blank'>
            Improve this map</a></strong>
          `,
          id: 'mapboxId' in config ? config.mapboxId : 'mapbox.streets',
          accessToken: config.mapboxApiToken
        }
      }
      return {
        maxZoom: 18
      }
    },
    mapProviderUrl: function () {
      if ('mapboxApiToken' in config) {
        return `https://api.tiles.mapbox.com/v4` +
               `/{id}/{z}/{x}/{y}.png` +
               `?access_token=${config.mapboxApiToken}`
      }
      return 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    }
  },

  computed: {
    mapStyle: function () {
      return {
        display: this.locs.length ? 'block' : 'none'
      }
    }
  },

  watch: {
    topUsers: function () {
      const data = {
        labels: this.topUsers.map((u) => u.name),
        series: [
          this.topUsers.map(function (u) {
            return { meta: u.name, value: u.score }
          })
        ]
      }
      Chartist.Bar('#top-users-chart', data, { plugins: this.chartPlugins })
    },
    locs: function () {
      let map = L.map('locs-map', { scrollWheelZoom: false, minZoom: 1 })
      map.fitWorld()
      map.setZoom(2)
      L.tileLayer(this.mapProviderUrl(), this.mapTileOpts()).addTo(map)
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
    this.fetchTopUsers()
    this.fetchGlobalStats()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';
@import '~chartist/dist/scss/chartist';
@import '~chartist-plugin-tooltips/dist/chartist-plugin-tooltip';
@import '~leaflet.markercluster/dist/MarkerCluster';
@import '~leaflet.markercluster/dist/MarkerCluster.Default';
</style>
