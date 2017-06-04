<template>
  <div id="landing">
    <landing-jumbotron v-on:scrollDown="nextComponent">
    </landing-jumbotron>
  </div>
</template>

<script>
import LandingJumbotron from '@/components/LandingJumbotron'

export default {
  name: 'landing',
  data: function () {
    return {}
  },
  components: {
    LandingJumbotron
  },
  methods: {
    nextComponent () {
      console.log('next')
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
