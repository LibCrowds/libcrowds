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

      <!-- Custom downloads tab -->
      <b-tabs card @input="onTabsChange">
        <b-tab title="Custom" no-body active>
          <b-table
            responsive
            striped
            hover
            outlined
            show-empty
            :dark="darkMode"
            :items="collection.info.export_formats"
            :fields="customTableFields">
            <template slot="action" slot-scope="fmt">
              <b-btn
                variant="success"
                size="sm"
                v-b-modal="customDataModalId"
                @click="customDownload = fmt.item">
                Download
              </b-btn>
            </template>
          </b-table>
        </b-tab>

        <!-- Projects downloads tab -->
        <b-tab title="Projects" no-body>
          <projects-table
            :filter="filter"
            :filter-by="filterBy"
            :collection="collection"
            ref="projects-table">
            <template slot="action" slot-scope="project">
              <b-btn
                :variant="darkMode ? 'dark' : 'success'"
                size="sm"
                v-b-modal="projectDataModalId"
                @click="projectDownload = project.item">
                Download
              </b-btn>
            </template>
          </projects-table>
        </b-tab>

      </b-tabs>

    </card-base>

    <data-modal
      lazy
      v-if="projectDownload"
      :items="projectDownloadItems"
      :endpoint="`/project/${projectDownload.short_name}/tasks/export`"
      :filename-prefix="projectDownload.short_name"
      :event-label="projectDownload.name"
      :modal-id="projectDataModalId"
      :project="projectDownload">
    </data-modal>

    <data-modal
      lazy
      v-if="customDownload"
      :items="customDownloadItems"
      :endpoint="customDownloadEndpoint"
      :filename-prefix="customDownload.short_name"
      :event-label="customDownload.short_name"
      :modal-id="customDataModalId"
      :project="customDownload">
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
      projectDownload: null,
      customDownload: null,
      projectDataModalId: 'project-data-download-modal',
      customDataModalId: 'custom-data-download-modal',
      projectDownloadItems: [
        { dataset: 'Tasks', type: 'task', format: 'csv' },
        { dataset: 'Tasks', type: 'task', format: 'json' },
        { dataset: 'Contributions', type: 'task_run', format: 'csv' },
        { dataset: 'Contributions', type: 'task_run', format: 'json' },
        { dataset: 'Results', type: 'result', format: 'csv' },
        { dataset: 'Results', type: 'result', format: 'json' }
      ],
      customTableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        motivation: {
          label: 'Motivation',
          class: 'text-center',
          sortable: true
        },
        action: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
  },

  components: {
    SortProjectsData,
    FilterProjectsData,
    ToggleCompletedData,
    ProjectsTable,
    DataModal,
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
      return 'Download all task and contribution data.'
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    customDownloadEndpoint () {
      if (this.customDownload) {
        return `/lc/categories/${this.collection.short_name}/exports/` +
          `${this.customDownload.id}/export`
      }
    },

    customDownloadItems () {
      return this.collection.info.export_formats.map(fmt => {
        return {
          dataset: fmt.name,
          type: fmt.id,
          format: 'csv'
        }
      })
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
