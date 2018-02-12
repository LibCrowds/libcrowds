<template>
  <div id="collection-fullscreen-dark-layout">
    <default-base
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
@import '~assets/style/settings';

#collection-fullscreen-dark-layout {
  .content {
    height: calc(100vh - #{$top-navbar-height});
  }

  #collection-navbar {
    background-color: #0D0D0D;

    .container {
      margin: 0 1rem;
      max-width: 100%;
    }
  }
}
</style>
