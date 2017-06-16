<template>
</template>

<script>
import 'cookieconsent'

export default {
  mounted () {
    const cookiesRoute = this.$router.resolve({ name: 'cookies' }).route
    const cookiesUrl = window.location.origin + cookiesRoute.path
    window.cookieconsent.initialise({
      content: {
        message: 'This website uses cookies to ensure you get the best ' +
                 'experience (mmm...cookies).',
        href: cookiesUrl
      },
      palette: {
        popup: {
          background: '#000'
        },
        button: {
          background: '#BA0000'
        }
      }
    })
  }
}
</script>

<style>
@import '~cookieconsent/build/cookieconsent.min.css'
</style>
