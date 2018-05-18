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

      <b-form slot="controls" :class="darkMode ? 'form-dark' : null">
        <b-form-input
          v-model="filter"
          class="search-control"
          size="sm"
          :placeholder="`Type to search by ${filterBy}`">
        </b-form-input>
      </b-form>

      <!-- Annotations downloads tab -->
      <b-tabs card @input="onTabsChange">
        <b-tab title="Annotations" no-body active>
          <b-table
            responsive
            striped
            hover
            show-empty
            :dark="darkMode"
            :items="motivations"
            :fields="collectionTableFields">
            <template slot="action" slot-scope="motivation">
              <b-btn
                variant="success"
                size="sm"
                v-b-modal="collectionDataModalId"
                @click="collectionDownload = motivation.item">
                Download
              </b-btn>
            </template>
          </b-table>
        </b-tab>

        <!-- Projects downloads tab -->
        <b-tab title="Projects" no-body>
          <projects-table
            ref="projects-table"
            :filter="filter"
            :filter-by="filterBy"
            :collection="collection">
            <template slot="action" slot-scope="project">
              <download-project-data
                :project="project.item">
              </download-project-data>
            </template>
          </projects-table>
        </b-tab>

      </b-tabs>

    </card-base>

    <data-modal
      lazy
      v-if="collectionDownload"
      :items="collectionDownloadItems"
      :endpoint="`/lc/categories/${collection.short_name}/export`"
      :filename-prefix="collectionDownload.type"
      :event-label="collectionDownload.type"
      :modal-id="collectionDataModalId">
    </data-modal>

  </div>
</template>

<script>
import marked from 'marked'
import localConfig from '@/local.config'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { filterProjects } from '@/mixins/filterProjects'
import { licenses } from '@/mixins/licenses'
import { getShortname } from '@/mixins/getShortname'
import SortProjectsData from '@/components/data/SortProjects'
import ToggleCompletedData from '@/components/data/ToggleCompleted'
import FilterProjectsData from '@/components/data/FilterProjects'
import ProjectsTable from '@/components/tables/Projects'
import DataModal from '@/components/modals/Data'
import CardBase from '@/components/cards/Base'
import DownloadProjectData from '@/components/data/DownloadProjectData'

export default {
  layout: 'collection-tabs',

  mixins: [
    fetchCollectionByName,
    filterProjects,
    licenses,
    collectionMetaTags,
    getShortname
  ],

  data () {
    return {
      localConfig: localConfig,
      title: 'Data',
      filter: null,
      filterBy: 'name',
      collectionDownload: null,
      collectionDataModalId: 'collection-data-download-modal',
      collectionTableFields: {
        name: {
          label: 'Motivation',
          sortable: true
        },
        action: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      motivations: [
        { name: 'Describing', type: 'describing' },
        { name: 'Tagging', type: 'tagging' },
        { name: 'Commenting', type: 'commenting' }
      ]
    }
  },

  components: {
    SortProjectsData,
    FilterProjectsData,
    ToggleCompletedData,
    ProjectsTable,
    DataModal,
    CardBase,
    DownloadProjectData
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
      return 'Download all task and contribution data.'
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    collectionDownloadItems () {
      return [
        {
          dataset: 'Annotations',
          type: this.collectionDownload.type,
          format: 'csv'
        },
        {
          dataset: 'Annotations',
          type: this.collectionDownload.type,
          format: 'json'
        }
      ]
    }
  },

  methods: {
    /**
     * Handle tabs being changed.
     */
    onTabsChange () {
      this.filter = null
      const table = this.$refs['projects-table']
      if (typeof table !== 'undefined') {
        table.reset()
      }
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>
