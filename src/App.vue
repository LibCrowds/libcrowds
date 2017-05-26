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
@import 'src/assets/style/_vars.scss';
@import '~bootstrap/scss/bootstrap';

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100vw;
  margin: auto;
}

#app {
  flex: 1 1 auto;
  position: relative;
  overflow-y: auto;
}
</style>
