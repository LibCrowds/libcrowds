<template>
  <div id="main-layout" :style="mainStyle">
    <app-navbar></app-navbar>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar'
import config from '@/config'

export default {
  data: function () {
    return {
      siteConfig: config[ this.$store.state.route.params.sitename ]
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
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

#main-layout {
  height: 100vh;
  overflow-y: auto;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

main {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 5rem;
}
</style>
