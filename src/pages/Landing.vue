<template>
  <div id="landing">
    <fading-jumbotron :bgImg="crowdImg" :scrollTo="scrollTo" :header="header"></fading-jumbotron>
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
      scrollTo: '#intro',
      header: 'Crowdsourcing projects from the British Library'
    }
  },
  components: { FadingJumbotron }
}
</script>

<style lang="scss" scoped>

</style>
