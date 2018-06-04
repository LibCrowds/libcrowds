<template>
  <dashboard-base :nav-items="navItems">

    <b-alert
      show
      variant="secondary"
      slot="message"
      class="text-center"
      v-if="missingPresenter">
      The collection microsite cannot be published until the task presenter
      has been configured; visit the
      <nuxt-link
        :to="{
          name: 'admin-collection-short_name-presenter',
          params: {
            short_name: currentCollection.short_name
          }
        }">
        Task Presenter settings
      </nuxt-link>
      page.
    </b-alert>

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

    missingPresenter () {
      if (
        !isEmpty(this.currentCollection) &&
        !this.currentCollection.info.presenter
      ) {
        return true
      }
      return false
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
            label: 'Page Content',
            link: {
              name: 'admin-collection-short_name-content',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Annotations',
            link: {
              name: 'admin-collection-short_name-annotations',
              params: {
                short_name: this.currentCollection.short_name
              }
            }
          },
          {
            label: 'Forum Integration',
            link: {
              name: 'admin-collection-short_name-forum',
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
            label: 'Project Filters',
            link: {
              name: 'admin-collection-short_name-filters',
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
