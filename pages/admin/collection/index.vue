<template>
  <card-base :title="title" :description="description">
    <b-btn
      slot="controls"
      variant="success"
      class="float-right"
      size="sm"
      :to="{
        name: 'admin-collection-new'
      }">
      New
    </b-btn>

    <infinite-loading-table
      ref="table"
      :fields="tableFields"
      domain-object="category">
      <template slot="action" scope="category">
        <b-btn
          variant="success"
          size="sm"
          block
          exact
          :to="{
            name: 'admin-collection-short_name-settings',
            params: {
              short_name: category.item.short_name
            }
          }">
          Open
        </b-btn>
      </template>
    </infinite-loading-table>

  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Open Collection',
      description: 'Manage the collection microsites.',
      tableFields: {
        name: {
          label: 'Name'
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        }
      }
    }
  },

  components: {
    PybossaForm,
    CardBase,
    InfiniteLoadingTable
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_COLLECTION', null)
  }
}
</script>
