<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import config from '@/config'

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
