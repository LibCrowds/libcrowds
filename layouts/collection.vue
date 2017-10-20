<template>
  <div id="collection-layout">
    <div id="collection-background" :style="bgStyle"></div>

    <!-- <collection-navbar></collection-navbar> -->

    <main>
      <nuxt></nuxt>
    </main>

    <app-footer></app-footer>

    <notifications position="bottom left"></notifications>

  </div>
</template>

<script>
import CollectionNavbar from '@/components/navbars/Collection'
import AppFooter from '@/components/footers/App'

export default {
  components: {
    CollectionNavbar,
    AppFooter
  },

  computed: {
    bgStyle () {
      const url = this.$store.state.background
      return {
        background: `url(${url}) no-repeat center left /cover fixed`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#collection-layout {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  #collection-background {
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
    flex: 1 1 auto
  }
}
</style>
