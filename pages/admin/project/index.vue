<template>
  <card-base :title="title" :description="description">

    <b-form-input
      slot="controls"
      v-model="filter"
      class="search-control"
      size="sm"
      :placeholder="`Type to search by ${filterBy}`">
    </b-form-input>

    <b-tabs ref="tabs" card @input="filter = null">
      <b-tab
        no-body
        v-for="collection in publishedCollections"
        :title="collection.name"
        :key="collection.id">
        <projects-table
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

  beforeMount () {
    this.$store.dispatch('UPDATE_CURRENT_PROJECT', {})
  }
}
</script>
