<template>
  <div id="app" :style="appStyle">
    <notifications></notifications>
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
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

export default {
  name: 'app',

  metaInfo: {
    titleTemplate: `%s - ${config.brand}`
  },

  components: {
    Notifications,
    AppNavbar,
    AppFooter
  },

  computed: {
    appStyle: function () {
      try {
        return {
          backgroundImage: `url('${require('@/custom/background.jpg')}')`
        }
      } catch (e) {
        return {
          backgroundImage: `url('${require('@/assets/img/background.jpg')}')`
        }
      }
    }
  },

  mounted () {
    this.$store.dispatch('UPDATE_CURRENT_USER')
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

#app {
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;

  main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }
}
</style>
