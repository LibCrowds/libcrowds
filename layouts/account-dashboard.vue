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
            name: 'account-username-settings-profile',
            params: {
              username: this.$route.params.username
            }
          }
        },
        {
          label: 'API',
          link: {
            name: 'account-username-settings-api',
            params: {
              username: this.$route.params.username
            }
          }
        },
        {
          label: 'Avatar',
          link: {
            name: 'account-username-settings-avatar',
            params: {
              username: this.$route.params.username
            }
          }
        },
        {
          label: 'Security',
          link: {
            name: 'account-username-settings-security',
            params: {
              username: this.$route.params.username
            }
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
