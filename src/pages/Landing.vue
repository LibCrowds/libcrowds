<template>
  <div id="landing">
    <fading-jumbotron :bgImg="crowdImg" :scrollAnchor="scrollAnchor" :header="header"></fading-jumbotron>
  </div>
</template>

<script>
import crowdImg from '@/assets/img/crowd.png'
import FadingJumbotron from '@/components/FadingJumbotron'

export default {
  name: 'landing',
  data: function () {
    return {
      crowdImg: crowdImg,
      scrollAnchor: '#intro',
      header: 'Crowdsourcing projects from the British Library'
    }
  },
  components: { FadingJumbotron }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
