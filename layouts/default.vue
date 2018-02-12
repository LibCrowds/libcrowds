<template>
  <default-base :navbar-brand="navbarBrand" fixed-top>
    <nuxt></nuxt>
  </default-base>
</template>

<script>
import localConfig from '@/local.config'
import DefaultBase from '@/layouts/bases/Default'

export default {
  components: {
    DefaultBase
  },

  computed: {
    navbarBrand () {
      return localConfig.brand
    }
  }
}
</script>
