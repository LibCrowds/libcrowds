<template>
  <div id="app">
    <div id="app-background" :style="appBgStyle"></div>
    <notifications></notifications>
    <cookie-consent></cookie-consent>
    <main>
      <router-view></router-view>
    </main>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import siteConfig from '@/settings/siteConfig'
import appBackground from '@/assets/img/app-background.jpg'
import Notifications from '@/components/Notifications'
import CookieConsent from '@/components/CookieConsent'

console.log(appBackground)

export default {
  name: 'app',

  metaInfo: {
    titleTemplate: `%s - ${siteConfig.brand}`,
    meta: [
      { name: 'description', content: siteConfig.description },

      // Facebook Open Graph Markup
      { property: 'og:url', content: window.location.href },
      { property: 'og:title', content: siteConfig.tagline },
      { property: 'og:description', content: siteConfig.description }
    ]
  },

  components: {
    Notifications,
    CookieConsent
  },

  computed: {
    appBgStyle: function () {
      return {
        background: `url(${appBackground}) no-repeat center center /cover fixed`
      }
    }
  },

  created () {
    // Start the progress bar when the app is first loaded
    this.$Progress.start()

    // Start the progress bar
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start()
      next()
    })

    // Stop the progress bar
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
  },

  mounted () {
    // Stop the progress bar when App.vue is loaded
    this.$Progress.finish()
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/main';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  #app-background {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    min-height: 100%;
    height: auto;
    width: 100%;
    min-width: 1024px;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
}
</style>
