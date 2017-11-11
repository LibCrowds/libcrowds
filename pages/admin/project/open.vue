<template>
  <b-card no-body>
    <div
      slot="header"
      class="mb-0 d-flex align-items-center justify-content-between">
      <span>
        <h6 class="mb-0">{{ title }}</h6>
        <p class="text-muted mb-0">
          <small>
            Open and manage projects.
          </small>
        </p>
      </span>
      <b-form-input
        v-model="filter"
        class="table-search"
        size="sm"
        :placeholder="`Type to search by ${filterBy}`">
      </b-form-input>
    </div>
    <infinite-loading-table
      domainObject="project"
      :fields="tableFields"
      :filter="filter"
      :filter-by="filterBy"
      :search-params="searchParams"
      no-border>
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
  </b-card>
</template>

<script>
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'

export default {
  layout: 'admin-project-dashboard',

  middleware: 'is-admin',

  data () {
    return {
      title: 'Open Project',
      tableFields: {
        name: {
          label: 'Name'
        },
        category_id: {
          label: 'Category ID',
          class: 'text-center d-none d-xl-table-cell',
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

  head () {
    return {
      title: this.title
    }
  },

  components: {
    InfiniteLoadingTable
  },

  computed: {
    searchParams () {
      const currentUser = this.$store.state.currentUser
      const params = {}
      if (!currentUser.admin) {
        params.owner_id = currentUser.id
      }
      return params
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>

<style lang="scss">
.table-search {
  max-width: 50%;
  border-radius: 100px;
  padding: 0.5rem 0.75rem;
}
</style>
