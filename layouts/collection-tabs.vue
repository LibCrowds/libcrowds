<template>
  <tabs-base
    :nav-items="navItems"
    :navbar-brand="currentCollection.name"
    :background-image-url="backgroundImageUrl">
    <nuxt></nuxt>
  </tabs-base>
</template>

<script>
import TabsBase from '@/layouts/bases/Tabs'

export default {
  components: {
    TabsBase
  },

  computed: {
    navItems () {
      return this.$store.state.collectionNavItems
    },

    currentCollection () {
      return this.$store.state.currentCollection
    },

    backgroundImageUrl () {
      if (
        typeof this.currentCollection.info !== 'undefined' &&
        this.currentCollection.info.background
      ) {
        return this.currentCollection.info.background
      }
      return require('~/assets/img/app-background.jpg')
    }
  }
}
</script>
