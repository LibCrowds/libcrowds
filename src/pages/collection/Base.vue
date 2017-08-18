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
    <collection-footer
      :collectionConfig="collectionConfig">
    </collection-footer>
  </div>
</template>

<script>
import CollectionNavbar from '@/components/navbars/CollectionNavbar'
import CollectionFooter from '@/components/footers/CollectionFooter'

export default {
  data: function () {
    return {
      collectionConfig: require(
        `../../settings/collections/${this.$route.params.collectionname}/config`
      )
    }
  },

  components: {
    CollectionNavbar,
    CollectionFooter
  },

  computed: {
    bgStyle: function () {
      const url = this.collectionConfig.bgImg
      return {
        background: `url(${url}) no-repeat center left /cover fixed`
      }
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
