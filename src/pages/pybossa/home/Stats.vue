<template>
  <div id="stats">
    <section class="p-3 p-md-5">

    </section>
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'stats',
  data: function () {
    return {
      config: config
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';
</style>
