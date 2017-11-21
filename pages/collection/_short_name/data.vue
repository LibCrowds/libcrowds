<template>
  <div id="collection-data">
    <h1 class="text-center">{{ title }}</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <card-base
      :title="title"
      id="download-data"
      class="collection-nav-item"
      data-title="Get the Data"
      :description="description">

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
            variant="success"
            size="sm"
            block
            v-b-modal="dataModalId"
            @click="activeProject = project.item">
            Download
          </b-btn>
        </template>
      </projects-table>
    </card-base>

    <data-modal
      lazy
      v-if="activeProject"
      :modal-id="dataModalId"
      :project="activeProject">
    </data-modal>

  </div>
</template>

<script>
import marked from 'marked'
import { metaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { filterProjects } from '@/mixins/filterProjects'
import { licenses } from '@/mixins/licenses'
import SortProjectsData from '@/components/data/SortProjects'
import ToggleCompletedData from '@/components/data/ToggleCompleted'
import FilterProjectsData from '@/components/data/FilterProjects'
import ProjectsTable from '@/components/tables/Projects'
import DataModal from '@/components/modals/Data'
import ProjectSortingCard from '@/components/cards/ProjectSorting'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, filterProjects, licenses, metaTags ],

  data () {
    return {
      title: 'Data',
      activeProject: null,
      dataModalId: 'data-download-modal',
      filter: null,
      filterBy: 'name'
    }
  },

  components: {
    SortProjectsData,
    FilterProjectsData,
    ToggleCompletedData,
    ProjectsTable,
    DataModal,
    ProjectSortingCard,
    CardBase
  },

  computed: {
    pageContent () {
      return marked(this.collection.info.content.data)
    },

    collection () {
      return this.$store.state.currentCollection
    },

    description () {
      if (this.collection.license) {
        return `All datasets generated from ${this.collection.name}
          projects are made available under a
          ${this.dataLicenses[this.collection.license].name} license.`
      }
      return 'Download the project data.'
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>
