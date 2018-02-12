<template>
  <default-base
    fixed-top
    transparent
    :navbar-brand="currentCollection.name"
    :background-image-url="currentCollection.info.background">
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
    }
  }
}
</script>
