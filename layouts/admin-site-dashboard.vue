<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import localConfig from '@/local.config'
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  middleware: 'is-admin',

  data () {
    return {
      navItems: [
        {
          label: 'Dashboard',
          exact: true,
          link: {
            name: 'admin-site'
          }
        },
        {
          label: 'Users',
          link: {
            name: 'admin-site-users'
          }
        },
        {
          label: 'Announcements',
          link: {
            name: 'admin-site-announcements'
          }
        },
        {
          label: 'Background Tasks',
          link: {
            name: 'admin-site-jobs'
          }
        }
      ]
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
