<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import DashboardBase from '@/components/DashboardBase'

export default {
  data () {
    return {
      navItems: [
        {
          label: 'Profile',
          link: {
            name: 'account-username-settings-profile',
            params: {
              params: this.$route.params.username
            }
          }
        },
        {
          label: 'API',
          link: {
            name: 'account-username-settings-api',
            params: {
              params: this.$route.params.username
            }
          }
        },
        {
          label: 'Avatar',
          link: {
            name: 'account-username-settings-avatar',
            params: {
              params: this.$route.params.username
            }
          }
        },
        {
          label: 'Security',
          link: {
            name: 'account-username-settings-security',
            params: {
              params: this.$route.params.username
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
