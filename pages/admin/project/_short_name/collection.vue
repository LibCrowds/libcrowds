<template>
  <card-base :title="title" :description="description">

    <search-form
      slot="controls"
      v-model="filter"
      :placeholder="`Type to search by ${filterBy}`">
    </search-form>

    <infinite-loading-table
      ref="table"
      :fields="tableFields"
      :filter="filter"
      :filter-by="filterBy"
      domain-object="category">
      <template slot="action" scope="collection">
        <b-btn
          variant="success"
          size="sm"
          :disabled="collection.item.id == project.category_id"
          @click="setCollection(collection.item)">
          Select
        </b-btn>
      </template>
    </infinite-loading-table>
  </card-base>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import { fetchProjectByName } from '@/mixins/fetchProjectByName'
import { metaTags } from '@/mixins/metaTags'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import CardBase from '@/components/cards/Base'
import SearchForm from '@/components/forms/Search'

export default {
  layout: 'admin-project-dashboard',

  middleware: 'is-admin',

  mixins: [ fetchProjectByName, notifications, metaTags ],

  data () {
    return {
      title: 'Collection',
      description: 'Choose the collection that this project belongs to.',
      tableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        }
      },
      searchParams: {},
      updatedCollectionId: null,
      filter: null,
      filterBy: 'name'
    }
  },

  components: {
    InfiniteLoadingTable,
    CardBase,
    SearchForm
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    }
  },

  methods: {
    /**
     * Set the collection for the project.
     * @param {Object} collection
     *   The collection.
     */
    setCollection (collection) {
      this.$axios.$put(`/api/project/${this.project.id}`, {
        category_id: collection.id
      }).then(data => {
        this.notifySuccess({ message: `Project moved to ${collection.name}` })
        this.$store.dispatch('UPDATE_CURRENT_PROJECT', data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
