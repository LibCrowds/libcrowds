<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import WebFont from 'webfontloader'
import config from '@/config'

WebFont.load({
  google: {
    families: ['Assistant', 'Roboto']
  }
})

export default {
  name: 'app',
  metaInfo: {
    title: config.title,
    titleTemplate: `%s | ${config.brand}`,
    meta: [
      { name: 'description', content: config.description }
    ]
  }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
</style>
