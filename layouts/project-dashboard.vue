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
          label: 'Settings',
          link: {
            name: 'project-shortname-settings',
            params: {
              shortname: this.$route.params.shortname
            }
          }
        },
        {
          label: 'Thumbnail',
          link: {
            name: 'project-shortname-thumbnail',
            params: {
              shortname: this.$route.params.shortname
            }
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
