<template>
</template>

<script>
// This page only exists separately so that we can redirect to it and sign
// out from both the main application and the forum (if SSO is enabled)
export default {
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

  created () {
    this.$notifications.flash(this.data)
    this.$router.push({ path: this.next })
  }
}
</script>
