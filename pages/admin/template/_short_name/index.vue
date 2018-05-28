<template>
  <card-base
    :title="title"
    :description="description"
    docs="/templates/introduction/">

    <b-btn
      slot="controls"
      class="float-md-right"
      size="sm"
      variant="success"
      :to="{
        name: 'admin-template-short_name-new'
      }">
      New
    </b-btn>

    <p slot="guidance">
      Click the <strong>New</strong> button above to create a new template, or
      update a current template by selecting it from the list below.
    </p>

    <b-table
      responsive
      striped
      hover
      show-empty
      :dark="darkMode"
      class="border-left-0 border-right-0 border-bottom-0"
      :items="currentCollection.info.templates"
      :fields="tableFields">
      <template slot="actions" slot-scope="template">
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'admin-template-short_name-id',
            params: {
              id: template.item.id
            }
          }">
          Open
        </b-btn>
      </template>
    </b-table>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-template-dashboard',

  mixins: [ metaTags, fetchCollectionByName ],

  data () {
    return {
      title: 'Project Templates',
      description: 'Create and manage project templates.',
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        actions: {
          label: 'Actions'
        }
      }
    }
  },

  components: {
    CardBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', {})
  }
}
</script>
