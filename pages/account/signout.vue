<template>
  <card-base title="Signing out">
    <b-alert
      show
      variant="info"
      class="m-2">
      Signing out...
    </b-alert>
  </card-base>
</template>

<script>
import CardBase from '@/components/cards/Base'

// This page exists so that we can redirect to it for signing out, for example
// when signing out via the forum
export default {
  layout: 'container',

  components: {
    CardBase
  },

  mounted () {
    return this.$store.dispatch('LOGOUT', this.$axios, this.$flarum)
      .then(data => {
        this.$router.push({ path: '/' })
      })
  }
}
</script>
