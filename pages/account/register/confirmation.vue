<template>
</template>

<script>
export default {
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

  created () {
    this.$notifications.flash(this.response)
    this.$router.push({ path: this.response.next })

    // Sign in to Flarum when a new email is confirmed. This will create a
    // new Flarum user if one does not already exist with this address.
    if (this.response.status === 'success') {
      this.$flarum.signin()
    }
  }
}
</script>
