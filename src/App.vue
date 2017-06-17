<template>
  <div id="app">
    <notifications></notifications>
    <cookie-consent></cookie-consent>
    <app-navbar></app-navbar>
    <main>
      <router-view></router-view>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import config from '@/config'
import Notifications from '@/components/Notifications'
import CookieConsent from '@/components/CookieConsent'
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

export default {
  name: 'app',

  metaInfo: {
    titleTemplate: `%s - ${config.brand}`,
    bodyAttrs: {
      style: `background: url('${config.bgImg}')
             no-repeat center center / cover fixed;`
    }
  },

  components: {
    Notifications,
    CookieConsent,
    AppNavbar,
    AppFooter
  },

  mounted () {
    this.$store.dispatch('UPDATE_CURRENT_USER')
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

#app {
  min-height: 100vh;

  main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
}
</style>
