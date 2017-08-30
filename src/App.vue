<template>
  <div id="app">
    <notifications></notifications>
    <cookie-consent></cookie-consent>
    <main>
      <router-view></router-view>
    </main>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'
import Notifications from '@/components/Notifications'
import CookieConsent from '@/components/CookieConsent'

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
}
</style>
