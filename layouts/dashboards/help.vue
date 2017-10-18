<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import DashboardBase from '@/layouts/dashboards/Base'

export default {
  data () {
    navItems: [
      { name: 'help-api', label: 'API' },
      { name: 'help-cookies', label: 'Cookies Policy' },
      { name: 'help-privacy', label: 'Privacy Policy' },
      { name: 'help-tos', label: 'Terms of Service' }
    ]
  },

  components: {
    DashboardBase
  }
}
</script>
