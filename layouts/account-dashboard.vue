<template>
  <dashboard-base
    :navItems="navItems"
    :titleBase="titleBase">
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

    titleBase () {
      return this.currentUser.fullname
    },

    navItems () {
      return [
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
    }
  },

  head () {
    return {
      titleTemplate: `%s - ${this.currentUser.name} | ${localConfig.brand}`
    }
  }
}
</script>
