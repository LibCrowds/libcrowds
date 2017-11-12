<template>
  <card-base :title="title" help="Manage the collection microsites">
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
      no-border
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
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'

export default {
  layout: 'admin-collection-dashboard',

  middleware: 'is-admin',

  data () {
    return {
      title: 'Open Collection',
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

  head () {
    return {
      title: this.title
    }
  },

  components: {
    PybossaForm,
    CardBase,
    InfiniteLoadingTable
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_COLLECTION', {})
  }
}
</script>
