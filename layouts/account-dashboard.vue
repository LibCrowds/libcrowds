<template>
  <dashboard-base :nav-items="navItems">
  </dashboard-base>
</template>

<script>
import localConfig from '@/local.config'
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  middleware: 'is-current-or-admin',

  components: {
    DashboardBase
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    navItems () {
      const items = {}
      items[this.currentUser.name] = [
        {
          label: 'Profile',
          link: {
            name: 'account-name-settings-profile',
            params: {
              name: this.currentUser.name
            }
          }
        },
        {
          label: 'API',
          link: {
            name: 'account-name-settings-api',
            params: {
              name: this.currentUser.name
            }
          }
        },
        {
          label: 'Avatar',
          link: {
            name: 'account-name-settings-avatar',
            params: {
              name: this.currentUser.name
            }
          }
        },
        {
          label: 'Security',
          link: {
            name: 'account-name-settings-security',
            params: {
              name: this.currentUser.name
            }
          }
        }
      ]
      return items
    }
  },

  head () {
    return {
      titleTemplate: `%s - ${this.currentUser.name} | ${localConfig.brand}`
    }
  }
}
</script>
