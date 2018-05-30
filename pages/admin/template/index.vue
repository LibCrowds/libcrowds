<template>
  <card-base :title="title" :description="description">

    <p slot="guidance">
      Each project template is associated with a particular collection
      microsite. To create or update a template please begin by selecting a
      collection microsite from the list below.
    </p>

    <infinite-loading-table
      ref="table"
      :fields="tableFields"
      domain-object="category">
      <template slot="action" slot-scope="category">
        <b-btn
          variant="success"
          size="sm"
          exact
          :to="{
            name: 'admin-template-short_name',
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
import CardBase from '@/components/cards/Base'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'

export default {
  layout: 'admin-template-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Choose a Collection',
      description: 'Manage the project templates for a collection.',
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
    CardBase,
    InfiniteLoadingTable
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_TEMPLATE', {})
  }
}
</script>
