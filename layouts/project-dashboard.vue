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
          label: 'Collection',
          link: {
            name: 'project-short_name-collection',
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
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    }
  },

  head () {
    return {
      titleTemplate: `%s - ${this.project.name} | ${localConfig.brand}`
    }
  }
}
</script>
