<template>
  <div class="app-navbar">
    <b-navbar toggleable type="inverse" sticky="top">

      <b-nav-toggle target="nav_collapse"></b-nav-toggle>

      <b-link class="navbar-brand" :to="{ name: 'home', params: { sitename: sitename }}">
        <span>{{ pbConfig.title }}</span>
      </b-link>

      <b-collapse is-nav id="nav_collapse">

        <b-nav is-nav-bar>
          <b-nav-item :to="{ name: 'about', params: { sitename: sitename }}">About</b-nav-item>
          <b-nav-item :to="{ name: 'projects', params: { sitename: sitename }}">Projects</b-nav-item>
          <b-nav-item :to="{ name: 'stats', params: { sitename: sitename }}">Statistics</b-nav-item>
          <b-nav-item :to="{ name: 'results', params: { sitename: sitename }}">Results</b-nav-item>
          <b-nav-item :to="{ name: 'data', params: { sitename: sitename }}">Data</b-nav-item>
        </b-nav>

        <b-nav is-nav-bar class="ml-auto">
          <b-nav-item-dropdown right>
            <b-dropdown-item to="#">Profile</b-dropdown-item>
            <b-dropdown-item to="#">Settings</b-dropdown-item>
            <b-dropdown-item to="#">New Project</b-dropdown-item>
            <b-dropdown-item to="#">Open Project</b-dropdown-item>
            <b-dropdown-item to="#">Admin</b-dropdown-item>
            <b-dropdown-item to="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>

        </b-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'app-navbar',
  data: function () {
    return {
      config: config,
      sitename: this.$store.state.route.params.sitename,
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ]
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
