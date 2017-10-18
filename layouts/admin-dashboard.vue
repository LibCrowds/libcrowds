<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import DashboardBase from '@/components/DashboardBase'

export default {
  data () {
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
  },

  components: {
    DashboardBase
  }
}
</script>
