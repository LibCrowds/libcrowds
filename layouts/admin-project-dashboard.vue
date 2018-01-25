<template>
  <dashboard-base
    :nav-items="navItems"
    :titleBase="titleBase">

    <b-alert
      show
      variant="secondary"
      slot="message"
      class="text-center"
      v-if="notPublished">
      This project is still in draft mode,
      <nuxt-link
        :to="{
          name: 'admin-project-short_name-publish',
          params: {
            short_name: this.project.short_name
          }
          }">
        click here to publish it.
      </nuxt-link>
    </b-alert>

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
          exact: true,
          link: {
            name: 'admin-project'
          }
        },
        {
          label: 'New Project',
          link: {
            name: 'admin-project-new'
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

    notPublished () {
      return !isEmpty(this.project) && !this.project.published
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    titleBase () {
      return this.project.name
    },

    projectNavItems () {
      return [
        {
          label: 'Thumbnail',
          link: {
            name: 'admin-project-short_name-thumbnail',
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
          label: 'Help',
          link: {
            name: 'admin-project-short_name-help',
            params: {
              short_name: this.project.short_name
            }
          }
        },
        {
          label: 'Results',
          link: {
            name: 'admin-project-short_name-results',
            params: {
              short_name: this.project.short_name
            }
          }
        },
        {
          label: 'Delete',
          link: {
            name: 'admin-project-short_name-delete',
            params: {
              short_name: this.project.short_name
            }
          }
        }
      ]
    },

    restrictedNavItems () {
      return [
        {
          seperator: true
        },
        {
          label: 'Details',
          link: {
            name: 'admin-project-short_name-details',
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
          label: 'Volume',
          link: {
            name: 'admin-project-short_name-volume',
            params: {
              short_name: this.project.short_name
            }
          }
        },
        {
          label: 'Template',
          link: {
            name: 'admin-project-short_name-template',
            params: {
              short_name: this.project.short_name
            }
          }
        }
      ]
    },

    navItems () {
      let navItems = JSON.parse(JSON.stringify(this.rootNavItems))
      if (isEmpty(this.project)) {
        return navItems
      } else {
        navItems = navItems.concat(this.projectNavItems)
      }

      if (this.notPublished) {
        navItems = navItems.concat([
          {
            label: 'Publish',
            link: {
              name: 'admin-project-short_name-publish',
              params: {
                short_name: this.project.short_name
              }
            }
          }
        ])
      }

      if (this.currentUser.admin) {
        navItems = navItems.concat(this.restrictedNavItems)
      }
      return navItems
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
