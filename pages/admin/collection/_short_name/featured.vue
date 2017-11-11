<template>
  <card-base
    :title="title"
    help="Choose the projects that appear on the microsite's homepage">

    <infinite-loading-table
      domain-object="project"
      :fields="tableFields"
      :search-params="searchParams"
      no-border>
      <template slot="action" scope="project">
        <b-btn
          :variant="project.item.featured ? 'warning' : 'success'"
          size="sm"
          block
          @click="toggleFeatured(project.item)">
          {{ getButtonText(project.item.featured) }}
        </b-btn>
      </template>
    </infinite-loading-table>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications ],

  middleware: 'is-admin',

  data () {
    return {
      title: 'Featured',
      tableFields: {
        name: {
          label: 'Name'
        },
        overall_progress: {
          label: 'Progress',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        },
        created: {
          label: 'Created',
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

  head () {
    return {
      title: this.title
    }
  },

  components: {
    InfiniteLoadingTable,
    CardBase
  },

  methods: {
    /**
     * Return the featured button text.
     * @param {Boolean} featured
     *   True if the project is featured, false otherwise.
     */
    getButtonText (featured) {
      return featured ? 'Remove from featured' : 'Add to featured'
    },

    /**
     * Add or remove a project from featured.
     * @param {Object} project
     *   The project.
     */
    toggleFeatured (project) {
      this.$axios.$put(`/api/project/${project.id}`, {
        featured: !project.featured
      }).then(data => {
        project.featured = !project.featured
        this.notify({
          type: 'success',
          title: 'Success',
          message: project.featured
            ? 'Project added to featured'
            : 'Project removed from featured'
        })
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    searchParams () {
      return {
        category_id: this.collection.id
      }
    }
  }
}
</script>
