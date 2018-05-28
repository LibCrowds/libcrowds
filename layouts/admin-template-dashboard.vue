<template>
  <dashboard-base :nav-items="navItems">

    <b-alert
      show
      variant="secondary"
      slot="message"
      class="text-center mb-0"
      v-if="taskNotConfigured">
      This template is incomplete,
      <nuxt-link
        :to="{
          name: 'admin-template-short_name-id-task',
          params: {
            id: currentTemplate.id
          }
        }">
        click here to configure the task.
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

  components: {
    DashboardBase
  },

  computed: {
    currentTemplate () {
      return this.$store.state.currentTemplate
    },

    taskNotConfigured () {
      const isTaskPage = (
        this.$route.name === 'admin-template-short_name-id-task'
      )
      return (
        !isEmpty(this.currentTemplate) &&
        !this.currentTemplate.task &&
        !isTaskPage
      )
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    navItems () {
      const items = {}
      if (!isEmpty(this.currentTemplate)) {
        items[this.currentTemplate.name] = [
          {
            label: 'Core Details',
            exact: true,
            link: {
              name: 'admin-template-short_name-id',
              params: {
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Task',
            link: {
              name: 'admin-template-short_name-id-task',
              params: {
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Redundancy',
            link: {
              name: 'admin-template-short_name-id-redundancy',
              params: {
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Parent',
            link: {
              name: 'admin-template-short_name-id-parent',
              params: {
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Analysis',
            link: {
              name: 'admin-template-short_name-id-analysis',
              params: {
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Tutorial',
            link: {
              name: 'admin-template-short_name-id-tutorial',
              params: {
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Delete',
            link: {
              name: 'admin-template-short_name-id-delete',
              params: {
                id: this.currentTemplate.id
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
      titleTemplate: isEmpty(this.currentTemplate)
        ? `%s | ${localConfig.brand}`
        : `%s - ${this.currentTemplate.name} | ${localConfig.brand}`
    }
  }
}
</script>
