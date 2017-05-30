<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import WebFont from 'webfontloader'
WebFont.load({
  google: {
    families: ['Assistant', 'Roboto']
  }
})

export default {
  name: 'app'
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
</style>
