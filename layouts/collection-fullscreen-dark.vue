<template>
  <div id="collection-fullscreen-dark-layout">
    <default-base
      force-dark-mode
      :navbar-brand="currentCollection.name"
      hide-footer>
      <div class="content">
        <nuxt></nuxt>
      </div>
    </default-base>
  </div>
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

<style lang="scss">
#collection-fullscreen-dark-layout {
  .content {
    height: calc(100vh - #{$top-navbar-height});
  }
}
</style>
