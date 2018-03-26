<template>
  <card-base>
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

// This page only exists separately so that we can redirect to it and sign
// out from both the main application and the forum (if SSO is enabled)
export default {
  layout: 'container',

  components: {
    CardBase
  },

  mounted () {
    this.$store.dispatch('LOGOUT', this.$axios, this.$flarum).then(data => {
      this.$notifications.flash(data)
      this.$router.push({ path: data.next || '/' })
    }).catch(err => {
      error(err)
    })
  }
}
</script>
