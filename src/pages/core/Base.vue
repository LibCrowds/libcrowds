<template>
  <div id="app-base">
    <div id="app-background" :style="appBgStyle"></div>
    <app-navbar></app-navbar>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import AppNavbar from '@/components/navbars/AppNavbar'
import appBackground from '@/assets/img/app-background.jpg'

export default {
  components: {
    AppNavbar
  },

  computed: {
    appBgStyle: function () {
      return {
        background: `url(${appBackground}) no-repeat center left /cover fixed`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#app-base {
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
