<template>
  <div id="collection-base">
    <div id="collection-background" :style="bgStyle"></div>
    <collection-navbar
      :collectionConfig="collectionConfig"
      :sticky="true"
      :fixed="null">
    </collection-navbar>
    <main>
      <router-view
        :collectionConfig="collectionConfig">
      </router-view>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'
import CollectionNavbar from '@/components/navs/CollectionNavbar'
import AppFooter from '@/components/footers/AppFooter'

export default {
  components: {
    CollectionNavbar,
    AppFooter
  },

  computed: {
    bgStyle: function () {
      const url = this.collectionConfig.bgImg
      return {
        background: `url(${url}) no-repeat center left /cover fixed`
      }
    },
    collectionConfig: function () {
      return siteConfig.collections[this.$route.params.collectionname]
    }
  }
}
</script>

<style lang="scss" scoped>
#collection-base {
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
}
</style>
