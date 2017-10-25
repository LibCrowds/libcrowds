<template>
  <div id="default-layout">
    <div id="app-background" :style="appBgStyle"></div>

    <app-navbar></app-navbar>

    <main>
      <nuxt></nuxt>
    </main>

    <app-footer :collections="publishedCollections"></app-footer>

  </div>
</template>

<script>
import AppFooter from '@/components/footers/App'
import AppNavbar from '@/components/navbars/App'
import appBackground from '@/assets/img/app-background.jpg'

export default {
  components: {
    AppNavbar,
    AppFooter
  },

  computed: {
    appBgStyle () {
      return {
        background: `url(${appBackground}) no-repeat center left /cover fixed`
      }
    },

    publishedCollections () {
      return this.$store.state.publishedCollections
    }
  }
}
</script>

<style lang="scss" scoped>
#default-layout {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url('~/assets/img/geometry.png');

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

  main {
    flex: 1 1 auto;
  }
}
</style>
