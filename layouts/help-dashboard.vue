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
  },

  components: {
    DashboardBase
  }
}
</script>
