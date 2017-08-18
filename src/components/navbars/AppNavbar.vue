<template>
  <b-navbar
    id="app-navbar"
    type="light"
    fixed="top">
    <div class="container">

      <b-link class="navbar-brand"
        :to="{
          name: 'landing'
        }">
        <span>{{ siteConfig.brand }}</span>
      </b-link>

    </div>
  </b-navbar>
</template>

<script>
import siteConfig from '@/settings/siteConfig'

export default {
  data: function () {
    return {
      siteConfig: siteConfig
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

#app-navbar {
  background-color: $white;
  padding: 0.75rem 0;

  .navbar-brand {
    position: relative;
    margin: 0;
    letter-spacing: 1.15px;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;
  }
}
</style>
