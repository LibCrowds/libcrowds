<template>
  <div id="app">
    <notifications></notifications>
    <cookie-consent></cookie-consent>

    <main>
      <router-view></router-view>
    </main>

  </div>
</template>

<script>
import config from '@/config'
import Notifications from '@/components/Notifications'
import CookieConsent from '@/components/CookieConsent'

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
    CookieConsent
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
