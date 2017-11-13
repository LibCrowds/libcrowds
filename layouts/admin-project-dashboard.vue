<template>
  <dashboard-base
    :navItems="navItems">
  </dashboard-base>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import localConfig from '@/local.config'
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  middleware: 'is-admin',

  data () {
    return {
      rootNavItems: [
        {
          label: 'Open Project',
          link: {
            name: 'admin-project-open'
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
    },

    projectNavItems () {
      return [
        {
          label: 'Settings',
          link: {
            name: 'admin-project-short_name-settings',
            params: {
              short_name: this.project.short_name
            }
          }
        },
        {
          label: 'Tags',
          link: {
            name: 'admin-project-short_name-tags',
            params: {
              short_name: this.project.short_name
            }
          }
        },
        {
          label: 'Collection',
          link: {
            name: 'admin-project-short_name-collection',
            params: {
              short_name: this.project.short_name
            }
          }
        },
        {
          label: 'Thumbnail',
          link: {
            name: 'admin-project-short_name-thumbnail',
            params: {
              short_name: this.project.short_name
            }
          }
        }
      ]
    },

    navItems () {
      if (isEmpty(this.project)) {
        return this.rootNavItems
      }
      return this.rootNavItems.concat(this.projectNavItems)
    }
  },

  head () {
    return {
      titleTemplate: isEmpty(this.project)
        ? `%s | ${localConfig.brand}`
        : `%s - ${this.project.name} | ${localConfig.brand}`
    }
  }
}
</script>
