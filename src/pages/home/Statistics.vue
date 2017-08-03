<template>

  <floating-tabs-layout :nav-items="navItems">

    <section>
      <h2 class="text-center">Statistics</h2>
      <hr>
      <p class="text-center lead" v-if="stats">
        {{ stats.n_total_users }} volunteers have participated in
        {{ stats.n_published_projects }} projects and made
        {{ stats.n_task_runs }} contributions.
      </p>
    </section>

    <section  :id="navItems[0].id">
      <h3 class="text-center">{{ navItems[0].text }}</h3>
      <div id="top-users-chart" class="ct-major-seventh"></div>
    </section>

    <section :id="navItems[1].id">
      <h3 class="text-center">{{ navItems[1].text }}</h3>
      <div class="container">
        <div id="locs-map"></div>
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
        { id: 'top-users', text: 'Locations of Anonymous Volunteers' }
      ],
      topUsers: [],
      locs: [],
      chartPlugins: [
        Chartist.plugins.tooltip()
      ],
      stats: null
    }
  },

  methods: {
    /**
     * Fetch global stats.
     */
    fetchGlobalStats () {
      pybossaApi.get('/stats/').then(r => {
        this.stats = r.data.stats
        if (r.data.show_locs) {
          this.locs = r.data.locs
        }
      })
    },

    /**
     * Fetch the leaderboard.
     */
    fetchLeaderboard () {
      pybossaApi.get(`leaderboard/window/0`).then(r => {
        this.topUsers = r.data.top_users.slice(0, 10)
      })
    },

    /**
     * Return the map tile options.
     */
    getMapTileOpts () {
      if ('mapboxPublicApiToken' in config) {
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
          accessToken: config.mapboxPublicApiToken
        }
      }
      return {
        maxZoom: 18
      }
    },

    /**
     * Return the map provider URL.
     */
    getMapProviderUrl () {
      if ('mapboxPublicApiToken' in config) {
        return `https://api.tiles.mapbox.com/v4` +
               `/{id}/{z}/{x}/{y}.png` +
               `?access_token=${config.mapboxPublicApiToken}`
      }
      return 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
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
      L.tileLayer(this.getMapProviderUrl(), this.getMapTileOpts()).addTo(map)
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

  mounted () {
    this.fetchLeaderboard()
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

#locs-map {
  display: block;
  height: 500px;
  width: 100%;
}
</style>
