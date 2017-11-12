<template>
  <div id="collection-data">
    <h1 class="text-center">Data</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <card-base
      title="Data"
      id="download-data"
      class="collection-nav-item"
      data-title="Get the Data"
      help="Download the project data">

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
        :collection="collection">
        <template slot="action" scope="project">
          <b-btn
            variant="success"
            size="sm"
            block
            @click="loadDataModal(project.item)">
            Download
          </b-btn>
        </template>
      </projects-table>
    </card-base>

    <data-modal
      v-if="activeProject"
      :show="showDataModal"
      :project="activeProject">
    </data-modal>

  </div>
</template>

<script>
import marked from 'marked'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { filterProjects } from '@/mixins/filterProjects'
import SortProjectsData from '@/components/data/SortProjects'
import ToggleCompletedData from '@/components/data/ToggleCompleted'
import FilterProjectsData from '@/components/data/FilterProjects'
import ProjectsTable from '@/components/tables/Projects'
import DataModal from '@/components/modals/Data'
import ProjectSortingCard from '@/components/cards/ProjectSorting'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName, filterProjects ],

  data () {
    return {
      activeProject: null,
      showDataModal: false,
      filter: null,
      filterBy: 'name'
    }
  },

  head () {
    return {
      title: 'Data',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `All datasets generated from ${this.collection.name}
            projects are made available under a ${this.collection.license}
            license.`
        }
      ]
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
    }
  },

  methods: {
    loadDataModal (project) {
      this.activeProject = project
      this.showDataModal = true
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>
