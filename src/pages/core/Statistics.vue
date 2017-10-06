<template>

  <div id="global-statistics">

    <section>
      <h2 class="text-center">Statistics</h2>
      <hr>
      <p class="text-center lead" v-if="stats">
        {{ stats.n_total_users }} volunteers have participated in
        {{ stats.n_published_projects }} projects and made
        {{ stats.n_task_runs }} contributions.
      </p>
    </section>

    <section>
      <div id="top-users-chart" class="ct-major-seventh"></div>
    </section>

    <section>
      <div class="container">
        <div id="locs-map"></div>
      </div>
    </section>

  </div>

</template>

<script>
import L from 'leaflet'
import 'leaflet.markercluster'
import Chartist from 'chartist'
import 'chartist-plugin-tooltips'
import siteConfig from '@/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      locs: [],
      showLocs: false,
      projects: {},
      stats: {},
      tasks: {},
      top5Projects: [],
      top5Users: [],
      users: {},
      topUsers: []
    }
  },

  metaInfo () {
    return {
      title: 'Statistics',
      meta: [
        {
          name: 'description',
          content: `Global statistics for ${siteConfig.brand}`
        }
      ]
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.locs = data.locs
      this.show_locs = data.show_locs
      this.projects = data.projects
      this.stats = data.stats
      this.tasks = data.tasks
      this.top5Projects = data.top_5_projects_24_hours
      this.top5Users = data.top_5_users_24_hours
      this.users = data.users
      this.topUsers = data.top_users.slice(0, 10)
    },

    /**
     * Render the locations map.
     */
    renderLocationsMap () {
      let providerUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      let tileOpts = {
        maxZoom: 18
      }

      if ('mapbox' in siteConfig) {
        tileOpts.id = siteConfig.mapbox.id
        tileOpts.accessToken = siteConfig.mapbox.publicApiToken
        tileOpts.attribution = `
          Map data:
          &copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a>
          &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>
          <strong><a href='https://www.mapbox.com/feedback/' target='_blank'>
          Improve this map</a></strong>
        `
      }

      if ('mapbox' in siteConfig) {
        providerUrl = `https://api.tiles.mapbox.com/v4` +
                      `/{id}/{z}/{x}/{y}.png` +
                      `?access_token=${siteConfig.mapbox.publicApiToken}`
      }

      let map = L.map('locs-map', { scrollWheelZoom: false, minZoom: 1 })
      map.fitWorld()
      map.setZoom(2)
      L.tileLayer(providerUrl, tileOpts).addTo(map)
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

  computed: {
    topUsersData: function () {
      return {
        labels: this.topUsers.map((u) => u.name),
        series: [
          this.topUsers.map(function (u) {
            return { meta: u.name, value: u.score }
          })
        ]
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    let data = {}
    pybossaApi.get('stats/').then(r => {
      data = r.data
      return pybossa.getLeaderboard()
    }).then(r => {
      data.top_users = r.data.top_users
      next(vm => vm.setData(data))
    })
  },

  mounted () {
    const opts = {
      plugins: [
        Chartist.plugins.tooltip()
      ]
    }

    Chartist.Bar('#top-users-chart', this.topUsersData, opts)

    if (this.showLocs) {
      this.renderLocationsMap()
    }
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
