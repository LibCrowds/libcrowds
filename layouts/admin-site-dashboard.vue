<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import localConfig from '@/local.config'
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  data () {
    return {
      navItems: [
        {
          label: 'Dashboard',
          link: {
            name: 'admin-site-dashboard'
          }
        },
        {
          label: 'Featured Projects',
          link: {
            name: 'admin-site-featured'
          }
        },
        {
          label: 'Collections',
          link: {
            name: 'admin-site-collections'
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
