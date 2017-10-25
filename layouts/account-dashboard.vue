<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  data () {
    return {
      navItems: [
        {
          label: 'Profile',
          link: {
            name: 'account-name-settings-profile',
            params: this.$route.params
          }
        },
        {
          label: 'API',
          link: {
            name: 'account-name-settings-api',
            params: this.$route.params
          }
        },
        {
          label: 'Avatar',
          link: {
            name: 'account-name-settings-avatar',
            params: this.$route.params
          }
        },
        {
          label: 'Security',
          link: {
            name: 'account-name-settings-security',
            params: this.$route.params
          }
        }
      ]
    }
  },

  components: {
    DashboardBase
  }
}
</script>
