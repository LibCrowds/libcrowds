<template>
  <dashboard-base :nav-items="navItems">

    <b-alert
      show
      variant="secondary"
      slot="message"
      class="text-center"
      v-if="notPublished">
      This project is still in draft mode,
      <nuxt-link
        v-if="currentUser.admin"
        :to="{
          name: 'admin-project-short_name-publish',
          params: {
            short_name: this.currentProject.short_name
          }
          }">
        click here to publish it.
      </nuxt-link>
      <template v-else>
        you will be notified once it has been published
      </template>
    </b-alert>

  </dashboard-base>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import localConfig from '@/local.config'
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  middleware: 'project-management',

  components: {
    DashboardBase
  },

  computed: {
    currentProject () {
      return this.$store.state.currentProject
    },

    notPublished () {
      return !isEmpty(this.currentProject) && !this.currentProject.published
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    rootNavItems () {
      return [
        {
          label: 'Core Details',
          link: {
            name: 'admin-project-short_name-details',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        },
        {
          label: 'Thumbnail',
          link: {
            name: 'admin-project-short_name-thumbnail',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        },
        {
          label: 'Tags',
          link: {
            name: 'admin-project-short_name-tags',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        },
        {
          label: 'Help',
          link: {
            name: 'admin-project-short_name-help',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        },
        {
          label: 'Results',
          link: {
            name: 'admin-project-short_name-results',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        },
        {
          label: 'Delete',
          link: {
            name: 'admin-project-short_name-delete',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        }
      ]
    },

    restrictedNavItems () {
      return [
        {
          label: 'Collection',
          link: {
            name: 'admin-project-short_name-collection',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        },
        {
          label: 'Volume',
          link: {
            name: 'admin-project-short_name-volume',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        },
        {
          label: 'Template',
          link: {
            name: 'admin-project-short_name-template',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        },
        {
          label: 'Webhooks',
          link: {
            name: 'admin-project-short_name-webhooks',
            params: {
              short_name: this.currentProject.short_name
            }
          }
        }
      ]
    },

    navItems () {
      const items = {}
      if (isEmpty(this.currentProject)) {
        return items
      }

      const key = this.currentProject.name
      items[key] = JSON.parse(JSON.stringify(this.rootNavItems))

      if (!this.currentUser.admin) {
        return items
      }

      items[key] = items[key].concat(this.restrictedNavItems)

      if (this.notPublished) {
        items[key] = items[key].concat([
          {
            label: 'Publish',
            link: {
              name: 'admin-project-short_name-publish',
              params: {
                short_name: this.currentProject.short_name
              }
            }
          }
        ])
      }

      return items
    }
  },

  head () {
    return {
      titleTemplate: isEmpty(this.currentProject)
        ? `%s | ${localConfig.brand}`
        : `%s - ${this.currentProject.name} | ${localConfig.brand}`
    }
  }
}
</script>
