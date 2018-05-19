<template>
  <card-base
    :title="title"
    :description="description"
    docs="/projects/collection/">
    <p slot="guidance">
      The collection microsite associated with a project will be set during
      project creation. However, on the rare occasion that it is necessary, it
      can be changed via the form below.
    </p>
    <b-form slot="controls" :class="darkMode ? 'form-dark' : null">
      <b-form-input
        v-model="filter"
        class="search-control"
        size="sm"
        :placeholder="`Type to search by ${filterBy}`">
      </b-form-input>
    </b-form>

    <infinite-loading-table
      ref="table"
      :fields="tableFields"
      :filter="filter"
      :filter-by="filterBy"
      domain-object="category">
      <template slot="action" slot-scope="collection">
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
import { fetchProjectByName } from '@/mixins/fetchProjectByName'
import { metaTags } from '@/mixins/metaTags'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  middleware: 'is-admin',

  mixins: [ fetchProjectByName, metaTags ],

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
    CardBase
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
        this.$notifications.success({
          message: `Project moved to ${collection.name}`
        })
        this.$store.dispatch('UPDATE_CURRENT_PROJECT', data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
