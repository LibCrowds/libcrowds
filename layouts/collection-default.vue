<template>
  <default-base
    fixed-top
    transparent
    :navbar-brand="currentCollection.name"
    :background-image-url="backgroundImageUrl">
    <nuxt></nuxt>
  </default-base>
</template>

<script>
import DefaultBase from '@/layouts/bases/Default'

export default {
  components: {
    DefaultBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    backgroundImageUrl () {
      if (this.currentCollection.info.background) {
        return this.currentCollection.info.background
      }
      return '~/assets/img/app-background.jpg'
    }
  }
}
</script>
