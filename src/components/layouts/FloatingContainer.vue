<template>
  <div class="floating-container" :style="mainStyle">
    <app-navbar></app-navbar>
    <main class="container mt-md-4 mb-5">
      <router-view></router-view>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

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
    AppFooter
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

.floating-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

main {
  flex: 1 1 auto;
}
</style>
