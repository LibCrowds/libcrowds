<template>
  <div class="site-base" :style="mainStyle">
    <app-navbar></app-navbar>
    <slot></slot>
    <site-footer></site-footer>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'
import SiteFooter from '@/components/SiteFooter'

export default {
  data: function () {
    return {
      siteConfig: this.$store.state.siteConfig
    }
  },

  computed: {
    mainStyle: function () {
      return {
        backgroundImage: `url('${this.siteConfig.bgImg}')`
      }
    }
  },

  components: {
    AppNavbar,
    SiteFooter
  },

  props: [
    'nav-items'
  ]
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.site-base {
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
</style>
