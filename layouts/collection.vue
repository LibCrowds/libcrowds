<template>
  <div id="collection-base-layout">
    <div id="collection-background" :style="bgStyle"></div>
    <collection-navbar
      :collection-config="collectionConfig">
    </collection-navbar>
    <main>
      <nuxt
        :collection-config="collectionConfig">
      </nuxt>
    </main>
    <app-footer></app-footer>

    <notifications position="bottom left"></notifications>

  </div>
</template>

<script>
import localConfig from '@/local.config'
import CollectionNavbar from '@/components/navs/CollectionNavbar'
import AppFooter from '@/components/footers/App'

export default {
  head () {
    const tmpl = `%s - ${this.collectionConfig.name} | ${localConfig.brand}`
    return {
      titleTemplate: tmpl,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.collectionConfig.description
        },

        // Facebook Open Graph Markup
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: this.collectionConfig.tagline },
        {
          property: 'og:description',
          content: this.collectionConfig.description
        }
      ]
    }
  },

  components: {
    CollectionNavbar,
    AppFooter
  },

  computed: {
    bgStyle () {
      const url = this.collectionConfig.bgImg
      return {
        background: `url(${url}) no-repeat center left /cover fixed`
      }
    },
    collectionConfig () {
      const collectionName = this.$route.params.collectionname
      return localConfig.collections[collectionName]
    }
  }
}
</script>

<style lang="scss" scoped>
#collection-base-layout {
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
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  main {
    flex: 1 1 auto
  }
}
</style>
