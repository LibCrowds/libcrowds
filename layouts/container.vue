<template>
  <default-base :navbar-brand="navbarBrand">
    <b-container class="my-4 my-lg-5">
      <b-row>
        <b-col xl="8" class="mx-auto">
          <nuxt></nuxt>
        </b-col>
      </b-row>
    </b-container>
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
