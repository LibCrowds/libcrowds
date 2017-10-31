<template>
  <default-base>
    <b-container class="my-4 my-lg-5">
      <b-col xl="8" class="mx-auto">
        <nuxt></nuxt>
      </b-col>
    </b-container>
  </default-base>
</template>

<script>
import DefaultBase from '@/layouts/bases/Default'

export default {
  components: {
    DefaultBase
  }
}
</script>
