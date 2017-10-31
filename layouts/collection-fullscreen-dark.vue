<template>
  <div id="collection-fullscreen-dark-layout">
    <collection-base hide-footer>
      <div class="content">
        <nuxt></nuxt>
      </div>
    </collection-base>
  </div>
</template>

<script>
import CollectionBase from '@/layouts/bases/Collection'

export default {
  components: {
    CollectionBase
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#collection-fullscreen-dark-layout {
  .content {
    height: calc(100vh - #{$collection-navbar-height});
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
