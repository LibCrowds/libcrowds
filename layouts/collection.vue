<template>
  <div id="collection-base-layout">
    <div id="collection-background" :style="bgStyle"></div>
    <collection-navbar
      :collectionConfig="collectionConfig"
      :currentUser="currentUser">
    </collection-navbar>
    <main>
      <nuxt
        :collectionConfig="collectionConfig"
        :currentUser="currentUser">
      </nuxt>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'
import CollectionNavbar from '@/components/navs/CollectionNavbar'
import AppFooter from '@/components/footers/AppFooter'

export default {
  metaInfo () {
    return {
      titleTemplate: `%s - ${this.collectionConfig.name} | ${siteConfig.brand}`,
      meta: [
        { name: 'description', content: this.collectionConfig.description },

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

  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },

  computed: {
    bgStyle: function () {
      const url = this.collectionConfig.bgImg
      return {
        background: `url(${url}) no-repeat center left /cover fixed`
      }
    },
    collectionConfig: function () {
      const collectionName = this.$route.params.collectionname
      return siteConfig.collections[collectionName]
    }
  }
}
</script>

<style lang="scss" scoped>
#collection-base-layout {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

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
