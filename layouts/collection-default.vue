<template>
  <default-base fixed="top" :collection="currentCollection">
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
