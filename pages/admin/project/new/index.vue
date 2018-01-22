<template>
  <card-base :title="title" :description="description">
    <p slot="guidance" class="lead">
      Welcome to the project builder
    </p>
    <p slot="guidance">
      The following pages contain a series of options for generating a
      new project from a chosen volume and template.
    </p>
    <p slot="guidance">
      To get started, select a collection from the table below.
    </p>

    <infinite-loading-table
      ref="table"
      :fields="tableFields"
      :search-params="tableSearchParams"
      domain-object="category">
      <template slot="action" scope="category">
        <b-btn
          variant="success"
          size="sm"
          exact
          :to="{
            name: 'admin-project-new-category_short_name',
            params: {
              category_short_name: category.item.short_name
            }
          }">
          Select
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
  layout: 'admin-project-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'New Project',
      description: 'Create a new project',
      tableFields: {
        name: {
          label: 'Name'
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        }
      },
      tableSearchParams: {
        info: 'published::true'
      }
    }
  },

  components: {
    CardBase,
    InfiniteLoadingTable
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
