<template>
  <card-base :title="title" :description="description">

    <b-form-input
      slot="controls"
      v-model="filter"
      class="search-control"
      size="sm"
      :placeholder="`Type to search by ${filterBy}`">
    </b-form-input>

    <projects-table
      :filter="filter"
      :filter-by="filterBy"
      no-border
      :collection="collection">
      <template slot="action" scope="project">
        <b-btn
          :variant="project.item.featured ? 'warning' : 'success'"
          size="sm"
          block
          @click="toggleFeatured(project.item)">
          {{ getButtonText(project.item.featured) }}
        </b-btn>
      </template>
    </projects-table>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import ProjectsTable from '@/components/tables/Projects'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, notifications, metaTags ],

  data () {
    return {
      title: 'Featured',
      description: `Choose the projects that appear on the microsite's
        homepage`,
      filter: null,
      filterBy: 'name'
    }
  },

  components: {
    ProjectsTable,
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
        this.notifySuccess({
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
