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
            name: 'admin-dashboard'
          }
        },
        {
          label: 'Featured Projects',
          link: {
            name: 'admin-featured'
          }
        },
        {
          label: 'Collections',
          link: {
            name: 'admin-collections'
          }
        },
        {
          label: 'Users',
          link: {
            name: 'admin-users'
          }
        },
        {
          label: 'Announcements',
          link: {
            name: 'admin-announcements'
          }
        },
        {
          label: 'Background Jobs',
          link: {
            name: 'admin-jobs'
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
