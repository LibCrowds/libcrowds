<template>
  <div id="app">
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>

<script>
import config from '@/config'
import Notifications from '@/components/Notifications'

export default {
  name: 'app',

  components: {
    Notifications
  },

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
