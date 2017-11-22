<template>
  <card-base :title="title" :description="description">

    <b-form-input
      slot="controls"
      v-model="filter"
      class="search-control"
      size="sm"
      :placeholder="`Type to search by ${filterBy}`">
    </b-form-input>

    <infinite-loading-table
      domainObject="project"
      :fields="tableFields"
      :filter="filter"
      :filter-by="filterBy"
      :search-params="searchParams">
      <template slot="action" scope="project">
        <b-btn
          variant="success"
          block
          size="sm"
          :to="{
            name: 'admin-project-short_name-settings',
            params: {
              short_name: project.item.short_name
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
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Open Project',
      description: 'Manage your projects',
      tableFields: {
        name: {
          label: 'Name'
        },
        nTags: {
          label: 'Tags',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        },
        category_id: {
          label: 'Category ID',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-lg-table-cell',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      filter: null,
      filterBy: 'name'
    }
  },

  components: {
    InfiniteLoadingTable,
    CardBase
  },

  computed: {
    searchParams () {
      return this.$store.state.currentUser.admin
        ? {}
        : { owner_id: this.$store.state.currentUser.id }
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
