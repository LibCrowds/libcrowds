<template>
  <div id="results">
    <section class="p-3 p-md-5">

    </section>
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'results',
  data: function () {
    return {
      config: config,
      pbConfig: config.pybossaSites[ this.$store.state.route.params.sitename ]
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
