<template>
</template>

<script>
import 'cookieconsent'

export default {
  mounted () {
    const cookiesRoute = this.$router.resolve({ name: 'cookies' }).route
    const cookiesUrl = window.location.origin + cookiesRoute.path
    window.cookieconsent.initialise({
      palette: {
        popup: {
          background: '#000'
        },
        button: {
          background: '#BA0000'
        }
      },
      content: {
        href: cookiesUrl
      }
    })
  }
}
</script>

<style>
@import '~cookieconsent/build/cookieconsent.min.css'
</style>
