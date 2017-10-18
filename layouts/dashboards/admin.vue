<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import DashboardBase from '@/layouts/dashboards/Base'

export default {
  data () {
    navItems: [
      { name: 'admin-dashboard', label: 'Dashboard' },
      { name: 'admin-featured', label: 'Featured Projects' },
      { name: 'admin-collections', label: 'Categories' },
      { name: 'admin-users', label: 'Users' },
      { name: 'admin-announcements', label: 'Announcements' },
      { name: 'admin-jobs', label: 'Background Jobs' }
    ]
  },

  components: {
    DashboardBase
  }
}
</script>
