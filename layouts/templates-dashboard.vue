<template>
  <dashboard-base :nav-items="navItems">

    <b-alert
      show
      v-if="currentTemplate.pending"
      variant="secondary"
      slot="message"
      class="text-center mb-0">
      This template is currently pending approval.
      <br>
      It can still be updated and, if approved, any updates will be pushed out
      to all projects using the template.
    </b-alert>

    <b-alert
      show
      variant="secondary"
      slot="message"
      class="text-center mb-0"
      v-if="taskNotConfigured">
      This template is incomplete,
      <nuxt-link
        :to="{
          name: 'account-name-templates-id-task',
          params: {
            name: currentUser.name,
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
  middleware: 'project-management',

  components: {
    DashboardBase
  },

  computed: {
    currentTemplate () {
      return this.$store.state.currentTemplate
    },

    taskNotConfigured () {
      const isTaskPage = this.$route.name === 'account-name-templates-id-task'
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
              name: 'account-name-templates-id',
              params: {
                name: this.currentUser.name,
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Task',
            link: {
              name: 'account-name-templates-id-task',
              params: {
                name: this.currentUser.name,
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Redundancy',
            link: {
              name: 'account-name-templates-id-redundancy',
              params: {
                name: this.currentUser.name,
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Analysis',
            link: {
              name: 'account-name-templates-id-analysis',
              params: {
                name: this.currentUser.name,
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Tutorial',
            link: {
              name: 'account-name-templates-id-tutorial',
              params: {
                name: this.currentUser.name,
                id: this.currentTemplate.id
              }
            }
          },
          {
            label: 'Delete',
            link: {
              name: 'account-name-templates-id-delete',
              params: {
                name: this.currentUser.name,
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
