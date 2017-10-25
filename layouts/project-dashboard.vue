<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  data () {
    return {
      navItems: [
        {
          label: 'Settings',
          link: {
            name: 'project-short_name-settings',
            params: this.$route.params
          }
        },
        {
          label: 'Tags',
          link: {
            name: 'project-short_name-tags',
            params: this.$route.params
          }
        },
        {
          label: 'Thumbnail',
          link: {
            name: 'project-short_name-thumbnail',
            params: this.$route.params
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
