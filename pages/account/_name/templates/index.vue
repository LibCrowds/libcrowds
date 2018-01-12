<template>
  <card-base :title="title" :description="description">
    <b-btn
      slot="controls"
      class="float-md-right"
      size="sm"
      variant="success"
      :to="{
        name: 'account-name-templates-new',
        params: {
          name: currentUser.name
        }
      }">
      New
    </b-btn>

    <b-table
      ref="table"
      responsive
      striped
      hover
      show-empty
      class="border-left-0 border-right-0 border-bottom-0"
      :items="templates"
      :fields="tableFields">
      <template slot="actions" scope="template">
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'account-name-templates-id',
            params: {
              name: currentUser.name,
              id: template.id
            }
          }">
          Open
        </b-btn>
      </template>
    </b-table>

  </card-base>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'templates-dashboard',

  mixins: [ notifications, metaTags ],

  data () {
    return {
      title: 'Project Templates',
      description: 'Create and manage your project templates.',
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        mode: {
          label: 'Mode',
          sortable: true
        },
        tag: {
          label: 'Tag',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
  },

  components: {
    CardBase
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    templates () {
      if (typeof this.currentUser.info.templates === 'undefined') {
        return []
      }
      return this.currentUser.info.templates
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', {})
  }
}
</script>
