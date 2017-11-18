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
          label: 'Open Collection',
          link: {
            name: 'admin-collection'
          }
        },
        {
          label: 'New Collection',
          link: {
            name: 'admin-collection-new'
          }
        }
      ]
    }
  },

  components: {
    DashboardBase
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    collectionNavItems () {
      return [
        {
          label: 'Settings',
          link: {
            name: 'admin-collection-short_name-settings',
            params: {
              short_name: this.collection.short_name
            }
          }
        },
        {
          label: 'Task Presenter',
          link: {
            name: 'admin-collection-short_name-presenter',
            params: {
              short_name: this.collection.short_name
            }
          }
        },
        {
          label: 'Content',
          link: {
            name: 'admin-collection-short_name-content',
            params: {
              short_name: this.collection.short_name
            }
          }
        },
        {
          label: 'Terminology',
          link: {
            name: 'admin-collection-short_name-terminology',
            params: {
              short_name: this.collection.short_name
            }
          }
        },
        {
          label: 'Tags',
          link: {
            name: 'admin-collection-short_name-tags',
            params: {
              short_name: this.collection.short_name
            }
          }
        },
        {
          label: 'Featured Projects',
          link: {
            name: 'admin-collection-short_name-featured',
            params: {
              short_name: this.collection.short_name
            }
          }
        },
        {
          label: 'Delete',
          link: {
            name: 'admin-collection-short_name-delete',
            params: {
              short_name: this.collection.short_name
            }
          }
        }
      ]
    },

    navItems () {
      if (isEmpty(this.collection)) {
        return this.rootNavItems
      }
      return this.rootNavItems.concat(this.collectionNavItems)
    }
  },

  head () {
    return {
      titleTemplate: isEmpty(this.collection)
        ? `%s | ${localConfig.brand}`
        : `%s - ${this.collection.name} | ${localConfig.brand}`
    }
  }
}
</script>
