<template>
  <div class="app-navbar">
    <b-navbar toggleable type="inverse">

      <b-nav-toggle target="nav_collapse"></b-nav-toggle>

      <b-link class="navbar-brand" to="#">
        <span>siteConfig.title</span>
      </b-link>

      <b-collapse is-nav id="nav_collapse">
        
        <b-nav is-nav-bar>
          <b-nav-item>About</b-nav-item>
          <b-nav-item>Projects</b-nav-item>
          <b-nav-item>Statistics</b-nav-item>
          <b-nav-item>Results</b-nav-item>
          <b-nav-item>Data</b-nav-item>
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
export default {
  name: 'app-navbar'
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
