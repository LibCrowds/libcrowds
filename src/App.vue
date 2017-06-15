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

  metaInfo: {
    titleTemplate: `%s - ${config.brand}`
  },

  components: {
    Notifications
  },

  mounted () {
    this.$store.dispatch('UPDATE_CURRENT_USER')
  }
}
</script>
