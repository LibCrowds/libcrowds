<template>
  <dashboard-base :nav-items="navItems">
  </dashboard-base>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import localConfig from '@/local.config'
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  middleware: 'is-admin',

  components: {
    DashboardBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    navItems () {
      const items = {}
      if (!isEmpty(this.currentCollection)) {
        items[this.currentCollection.name] = [
          {
            label: 'Core Details',
            link: {
              name: 'admin-collection-short_name-details',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Content',
            link: {
              name: 'admin-collection-short_name-content',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Celebrations',
            link: {
              name: 'admin-collection-short_name-celebrations',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Terminology',
            link: {
              name: 'admin-collection-short_name-terminology',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Tags',
            link: {
              name: 'admin-collection-short_name-tags',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Volumes',
            link: {
              name: 'admin-collection-short_name-volumes',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Export Formats',
            link: {
              name: 'admin-collection-short_name-exports',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Featured Projects',
            link: {
              name: 'admin-collection-short_name-featured',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Task Presenter',
            link: {
              name: 'admin-collection-short_name-presenter',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Delete',
            link: {
              name: 'admin-collection-short_name-delete',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          }
        ]
      }
      return items
    }
  },

  head () {
    return {
      titleTemplate: isEmpty(this.currentCollection)
        ? `%s | ${localConfig.brand}`
        : `%s - ${this.currentCollection.name} | ${localConfig.brand}`
    }
  }
}
</script>
