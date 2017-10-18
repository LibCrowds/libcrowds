<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import DashboardBase from '@/layouts/Base'

export default {
  data () {
    navItems: [
      {
        label: 'Profile',
        link: {
          name: 'account-username-settings-profile',
          params: {
            params: $route.params.username
          }
        }
      },
      {
        label: 'API',
        link: {
          name: 'account-username-settings-api',
          params: {
            params: $route.params.username
          }
        }
      },
      {
        label: 'Avatar',
        link: {
          name: 'account-username-settings-avatar',
          params: {
            params: $route.params.username
          }
        }
      },
      {
        label: 'Security',
        link: {
          name: 'account-username-settings-security',
          params: {
            params: $route.params.username
          }
        }
      }
    ]
  },

  components: {
    DashboardBase
  }
}
</script>
