<template>
  <div id="collection-layout-base">
    <div id="collection-background" :style="bgStyle"></div>

    <collection-navbar
      :slim="slimNavbar"
      :collection="collection"
      :current-user="currentUser">
    </collection-navbar>

    <main>
      <slot></slot>
    </main>

    <app-footer
      v-if="!hideFooter"
      :collections="publishedCollections">
    </app-footer>

  </div>
</template>

<script>
import localConfig from '@/local.config'
import CollectionNavbar from '@/components/navbars/Collection'
import AppFooter from '@/components/footers/App'

export default {
  components: {
    CollectionNavbar,
    AppFooter
  },

  props: {
    hideFooter: {
      type: Boolean,
      default: false
    },
    slimNavbar: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    bgStyle () {
      if (!this.collection.info || !this.collection.info.background) {
        return
      }
      return {
        backgroundImage: `url(${this.collection.info.background})`
      }
    },

    publishedCollections () {
      return this.$store.state.publishedCollections
    },

    currentUser () {
      return this.$store.state.currentUser
    }
  },

  head () {
    return {
      titleTemplate: `%s - ${this.collection.name} | ${localConfig.brand}`
    }
  }
}
</script>

<style lang="scss" scoped>
#collection-layout-base {
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
    background-position: top center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('~/assets/img/app-background.jpg');
  }

  main {
    flex: 1 1 auto
  }
}
</style>
