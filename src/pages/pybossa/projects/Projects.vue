<template>
  <div id="projects">
    <section class="p-3 p-md-5">

    </section>
  </div>
</template>

<script>
import config from '@/config'
import marked from 'marked'

export default {
  name: 'projects',
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
