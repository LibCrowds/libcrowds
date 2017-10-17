<template>
  <div id="collection-base-layout">
    <div id="collection-background" :style="bgStyle"></div>
    <collection-navbar
      :collection="collection">
    </collection-navbar>
    <main>
      <nuxt
        :collection="collection">
      </nuxt>
    </main>
    <app-footer></app-footer>

    <notifications position="bottom left"></notifications>

  </div>
</template>

<script>
import localConfig from '@/local.config'
import CollectionNavbar from '@/components/navbars/Collection'
import AppFooter from '@/components/footers/App'

export default {
  head () {
    const tmpl = `%s - ${this.collection.name} | ${localConfig.brand}`
    return {
      titleTemplate: tmpl,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.collection.description
        },

        // Facebook Open Graph Markup
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: this.collection.tagline },
        {
          property: 'og:description',
          content: this.collection.description
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
      const url = this.collection.bgImg
      return {
        background: `url(${url}) no-repeat center left /cover fixed`
      }
    },
    collection () {
      const key = this.$route.params.key
      return localConfig.collections[key]
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
