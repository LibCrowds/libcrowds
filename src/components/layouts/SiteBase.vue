<template>
  <div class="site-base" :style="mainStyle">
    <app-navbar></app-navbar>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'

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
    AppNavbar
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
  display: flex;
  flex-direction: column;
}

main {
  flex: 1 1 auto;
}
</style>
