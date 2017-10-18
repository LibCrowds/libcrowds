<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import DashboardBase from '@/layouts/Base'

export default {
  data () {
    navItems: [
      { name: 'admin-dashboard', label: 'Dashboard' },
      { name: 'admin-featured', label: 'Featured Projects' },
      { name: 'admin-categories', label: 'Categories' },
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
