<template>
  <card-base :title="title" :description="description">

    <b-form slot="controls" :class="darkMode ? 'form-dark' : null">
      <b-form-input
        v-model="filter"
        class="search-control"
        size="sm"
        :placeholder="`Type to search by ${filterBy}`">
      </b-form-input>
    </b-form>

    <b-tabs card @input="onTabChange">
      <b-tab
        no-body
        v-for="(collection, index) in publishedCollections"
        :title="collection.name"
        :key="collection.id">
        <projects-table
          :ref="`table-${index}`"
          :filter="filter"
          :filter-by="filterBy"
          :collection="collection">
          <template slot="action" scope="project">
            <b-btn
              variant="success"
              size="sm"
              :to="{
                name: 'admin-project-short_name-details',
                params: {
                  short_name: project.item.short_name
                }
              }">
              Open
            </b-btn>
          </template>
        </projects-table>
      </b-tab>
    </b-tabs>

  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import CardBase from '@/components/cards/Base'
import ProjectsTable from '@/components/tables/Projects'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Open Project',
      description: 'Manage your projects',
      filter: null,
      filterBy: 'name'
    }
  },

  components: {
    InfiniteLoadingTable,
    CardBase,
    ProjectsTable
  },

  computed: {
    searchParams () {
      return this.$store.state.currentUser.admin
        ? {}
        : { owner_id: this.$store.state.currentUser.id }
    },

    publishedCollections () {
      return this.$store.state.publishedCollections
    }
  },

  methods: {
    /**
     * Handle tab change.
     * @param {Number} index
     *   The tab index.
     */
    onTabChange (index) {
      this.filter = null
      const table = this.$refs[`table-${index}`][0]
      if (typeof table !== 'undefined') {
        table.reset()
      }
    }
  },

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
