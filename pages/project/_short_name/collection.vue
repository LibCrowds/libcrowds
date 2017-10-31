<template>
  <b-card
    no-body>
    <div slot="header" class="mb-0">
      <h6 class="mb-0">{{ title }}</h6>
      <p class="text-muted mb-0">
        <small>
          Choose the collection microsite that this project should appear on.
        </small>
      </p>
    </div>

    <infinite-loading-table
      ref="table"
      :fields="tableFields"
      no-border
      domain-object="category">
      <template slot="action" scope="collection">
        <b-btn
          variant="success"
          size="sm"
          block
          :disabled="collection.item.id == project.category_id"
          @click="setCollection(collection.item)">
          Select
        </b-btn>
      </template>
    </infinite-loading-table>
  </b-card>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import { fetchProjectByName } from '@/mixins/fetchProjectByName'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'

export default {
  layout: 'project-dashboard',

  mixins: [ fetchProjectByName, notifications ],

  data () {
    return {
      title: 'Set Collection',
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
      updatedCollectionId: null
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
        this.notify({
          type: 'success',
          title: 'Success',
          message: `Project moved to ${collection.name}`
        })
        this.$store.dispatch('UPDATE_CURRENT_PROJECT', data)
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    }
  }
}
</script>
