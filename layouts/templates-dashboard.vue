<template>
  <dashboard-base
    :navItems="navItems"
    :titleBase="titleBase">
  </dashboard-base>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import localConfig from '@/local.config'
import DashboardBase from '@/layouts/bases/Dashboard'

export default {
  middleware: 'is-logged-in',

  components: {
    DashboardBase
  },

  computed: {
    currentTemplate () {
      return this.$store.state.currentTemplate
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    titleBase () {
      return this.currentTemplate.name
    },

    rootNavItems () {
      return [
        {
          label: 'Open Template',
          exact: true,
          link: {
            name: 'account-name-templates',
            params: {
              name: this.currentUser.name
            }
          }
        },
        {
          label: 'New Template',
          link: {
            name: 'account-name-templates-new',
            params: {
              name: this.currentUser.name
            }
          }
        }
      ]
    },

    templateNavItems () {
      return [
        {
          label: 'Core Details',
          link: {
            name: 'account-name-templates-id',
            params: {
              name: this.currentUser.name,
              id: this.currentTemplate.id
            }
          }
        },
        {
          label: 'Task Details',
          link: {
            name: 'account-name-templates-id-task',
            params: {
              name: this.currentUser.name,
              id: this.currentTemplate.id
            }
          }
        },
        {
          label: 'Analysis Rules',
          link: {
            name: 'account-name-templates-id-rules',
            params: {
              name: this.currentUser.name,
              id: this.currentTemplate.id
            }
          }
        }
      ]
    },

    navItems () {
      if (isEmpty(this.currentTemplate)) {
        return this.rootNavItems
      }
      return this.rootNavItems.concat(this.templateNavItems)
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
