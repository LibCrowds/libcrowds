<template>
  <b-card no-body :header="title">
    <infinite-loading-table
      domainObject="project"
      :fields="tableFields"
      :search-params="searchParams"
      no-border>
      <template slot="action" scope="project">
        <b-btn
          variant="success"
          size="sm"
          block
          :to="{
            name: 'project-short_name-settings',
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
  layout: 'project-dashboard',

  fetch ({ store }) {
    store.dispatch('UPDATE_CURRENT_PROJECT', {})
  },

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
      }
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

  head () {
    return {
      title: this.title
    }
  }
}
</script>
