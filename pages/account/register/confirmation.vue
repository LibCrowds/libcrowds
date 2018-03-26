<template>
  <card-base>
    <b-alert
      show
      variant="info"
      class="m-2">
      Confirming email address...
    </b-alert>
  </card-base>
</template>

<script>
export default {
  layout: 'container',

  asyncData ({ app, error, redirect, route }) {
    return app.$axios.$get('/account/register/confirmation', {
      params: route.query
    }).then(data => {
      return {
        response: data
      }
    }).catch(err => {
      error(err)
    })
  },

  beforeMount () {
    this.$notifications.flash(this.response)
    this.$router.push({ path: this.response.next })
  }
}
</script>
