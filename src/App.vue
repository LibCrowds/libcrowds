<template>
  <div id="app">
    <notifications></notifications>
    <router-view></router-view>
  </div>
</template>

<script>
import config from '@/config'
import Notifications from '@/components/Notifications'
import store from '@/store'

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
  },

  mounted () {
    store.dispatch('UPDATE_CURRENT_USER')
  }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
</style>
