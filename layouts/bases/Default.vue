<template>
  <div id="default-layout-base">

    <app-navbar :current-user="currentUser"></app-navbar>

    <main>
      <slot></slot>
    </main>

    <app-footer :collections="publishedCollections"></app-footer>

  </div>
</template>

<script>
import AppFooter from '@/components/footers/App'
import AppNavbar from '@/components/navbars/App'

export default {
  components: {
    AppNavbar,
    AppFooter
  },

  computed: {
    publishedCollections () {
      return this.$store.state.publishedCollections
    },

    currentUser () {
      console.log(this.$store.state.currentUser)
      return this.$store.state.currentUser
    }
  }
}
</script>

<style lang="scss" scoped>
#default-layout-base {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: url('~/assets/img/geometry.png');

  main {
    flex: 1 1 auto;
  }
}
</style>
