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

  asyncData ({ app, store, error }) {
    return store.dispatch('LOGOUT', app.$axios, app.$flarum).then(data => {
      return {
        data: data,
        next: data.next || '/'
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    CardBase
  },

  beforeMount () {
    this.$notifications.flash(this.data)
    this.$router.push({ path: this.next })
  }
}
</script>
