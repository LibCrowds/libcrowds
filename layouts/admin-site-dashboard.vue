<template>
  <dashboard-base
    :nav-items="navItems">
  </dashboard-base>
</template>

<script>
import localConfig from '@/local.config'
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  middleware: 'is-admin',

  data () {
    return {
      navItems: {}
    }
  },

  components: {
    DashboardBase
  },

  head () {
    return {
      titleTemplate: `%s - Admin | ${localConfig.brand}`
    }
  }
}
</script>
