<template>
  <dashboard-base
    :nav-items="navItems">
  </dashboard-base>
</template>

<script>
import localConfig from '@/local.config'
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  data () {
    return {
      navItems: {
        'Help': [
          {
            label: 'API',
            link: {
              name: 'help-api'
            }
          },
          {
            label: 'Cookies Policy',
            link: {
              name: 'help-cookies'
            }
          },
          {
            label: 'Privacy Policy',
            link: {
              name: 'help-privacy'
            }
          },
          {
            label: 'Terms of Service',
            link: {
              name: 'help-tos'
            }
          }
        ]
      }
    }
  },

  components: {
    DashboardBase
  },

  head () {
    return {
      titleTemplate: `%s - Help | ${localConfig.brand}`
    }
  }
}
</script>
