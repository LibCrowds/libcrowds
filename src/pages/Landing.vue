<template>
  <fading-jumbotron :bgImg="crowdImg" :scrollTo="scrollTo"></fading-jumbotron>
</template>

<script>
import crowdImg from '@/assets/img/crowd.png'
import FadingJumbotron from '@/components/FadingJumbotron'

export default {
  name: 'landing',
  data: function () {
    return {
      crowdImg: crowdImg,
      scrollTo: '#intro'
    }
  },
  components: { FadingJumbotron }
}
</script>

<style lang="scss" scoped>

</style>
