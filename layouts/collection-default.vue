<template>
  <default-base
    fixed
    :navbar-brand="currentCollection.name"
    :collection="currentCollection"
    navbar-class="transparent navbar-dark">
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
