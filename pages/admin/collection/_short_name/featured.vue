<template>
  <card-base
    :title="title"
    :description="description"
    docs="/collections/featured/">

    <b-form slot="controls" :class="darkMode ? 'form-dark' : null">
      <b-form-input
        v-model="searchString"
        class="search-control"
        size="sm"
        :placeholder="`Type to search by ${searchKeys.join(', ')}`">
      </b-form-input>
    </b-form>

    <p slot="guidance">
      Use the table below to select projects to be featured on the collection
      microsite's homepage.
    </p>
    <p slot="guidance">
      If no projects are selected then the top three projects that are closest
      to completion will be used instead. This approach may cause a lack of
      variety in the chosen projects but does mean that the list doesn't have
      to be constantly updated.
    </p>

    <infinite-loading-table
      :fields="projectTableFields"
      :search-string="searchString"
      :search-keys="searchKeys"
      :search-params="{
        category_id: collection.id,
        stats: 1,
        all: 1
      }"
      domain-object="project">
      <template slot="action" slot-scope="row">
        <b-btn
          :variant="row.item.featured ? 'warning' : 'success'"
          size="sm"
          @click="toggleFeatured(row.item)">
          {{ getButtonText(row.item.featured) }}
        </b-btn>
      </template>
    </infinite-loading-table>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Featured',
      description: `Choose the projects that appear on the microsite's
        homepage.`,
      searchString: null,
      searchKeys: ['name'],
      projectTableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        'stats.overall_progress': {
          label: 'Progress',
          class: 'text-center d-none d-md-table-cell'
        }
      }
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
        this.$notifications.success({
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
    }
  }
}
</script>
