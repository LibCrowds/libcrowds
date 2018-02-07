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

      <b-tabs card @input="onTabsChange">
        <b-tab title="Volumes" no-body active>
          <b-alert
            v-if="unknownProjects.length"
            show
            variant="warning"
            class="mb-0">
            <p class="mb-0">
              The data below is incomplete as the collection contains projects
              associated with a unknown volumes. This will need be fixed
              by a {{ localConfig.brand }} administrator.
            </p>
            <template v-if="currentUser.admin">
              <p class="mb-2">
                Please correct the volumes for the following projects:
              </p>
              <ul>
                <li v-for="project in unknownProjects" :key="project.id">
                  <nuxt-link
                    :to="{
                      name: 'admin-project-short_name-volume',
                      params: {
                        short_name: project.short_name
                      }
                    }">
                    {{ project.name }}
                  </nuxt-link>
                </li>
              </ul>
            </template>
          </b-alert>
          <b-alert
            v-if="collection && !collection.info.export_formats.length"
            show
            variant="info"
            class="mb-0">
            <p class="mb-0">
              No volume-level exports have been setup for this collection.
              Click the Projects tab above to download the raw, project-level
              data.
            </p>
          </b-alert>
          <volumes-table
            show-details
            :volumes="volumes"
            :filter="filter"
            :filter-by="filterBy">
            <template slot="action" scope="volume">
              <b-btn
                v-if="collection.info.export_formats.length"
                variant="success"
                size="sm"
                block
                v-b-modal="volumeDataModalId"
                @click="downloadVolume = volume.item">
                Download
              </b-btn>
            </template>
          </volumes-table>
        </b-tab>

        <b-tab title="Projects" no-body>
          <projects-table
            :filter="filter"
            :filter-by="filterBy"
            :collection="collection"
            ref="projects-table">
            <template slot="action" scope="project">
              <b-btn
                variant="success"
                size="sm"
                block
                v-b-modal="projectDataModalId"
                @click="downloadProject = project.item">
                Download
              </b-btn>
            </template>
          </projects-table>
        </b-tab>

      </b-tabs>
    </card-base>

    <data-modal
      lazy
      v-if="downloadProject"
      :items="projectDownloadItems"
      :endpoint="`/project/${downloadProject.short_name}/tasks/export`"
      :filename-prefix="downloadProject.short_name"
      :event-label="downloadProject.name"
      :modal-id="dataModalId"
      :project="downloadProject">
    </data-modal>

    <data-modal
      lazy
      v-if="downloadVolume"
      :items="volumeDownloadItems"
      :endpoint="downloadVolumeEndpoint"
      :filename-prefix="getShortname(downloadVolume.short_name)"
      :event-label="downloadVolume.name"
      :modal-id="volumeDataModalId"
      :project="downloadVolume">
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
import ProjectSortingCard from '@/components/cards/ProjectSorting'
import CardBase from '@/components/cards/Base'
import VolumesTable from '@/components/tables/Volumes'

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
      downloadProject: null,
      downloadVolume: null,
      projectDataModalId: 'project-data-download-modal',
      volumeDataModalId: 'volume-data-download-modal',
      projectDownloadItems: [
        { dataset: 'Tasks', type: 'task', format: 'csv' },
        { dataset: 'Tasks', type: 'task', format: 'json' },
        { dataset: 'Task Runs', type: 'task_run', format: 'csv' },
        { dataset: 'Task Runs', type: 'task_run', format: 'json' },
        { dataset: 'Results', type: 'result', format: 'csv' },
        { dataset: 'Results', type: 'result', format: 'json' }
      ]
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/libcrowds/categories/${params.short_name}/volumes`
    return app.$axios.$get(endpoint).then(data => {
      return {
        volumes: data.volumes.map(volume => {
          volume._showDetails = false
          return volume
        }),
        unknownProjects: data.unknown_projects
      }
    })
  },

  components: {
    SortProjectsData,
    FilterProjectsData,
    ToggleCompletedData,
    ProjectsTable,
    DataModal,
    ProjectSortingCard,
    CardBase,
    VolumesTable
  },

  computed: {
    pageContent () {
      return marked(this.collection.info.content.data)
    },

    collection () {
      return this.$store.state.currentCollection
    },

    volumeDownloadItems () {
      return this.collection.info.export_formats.map(fmt => {
        return { dataset: fmt.name, type: fmt.id, format: 'csv' }
      })
    },

    description () {
      if (this.collection.license) {
        return `All datasets generated from ${this.collection.name}
          projects are made available under a
          ${this.dataLicenses[this.collection.license].name} license.`
      }
      return 'Download the project data.'
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    downloadVolumeEndpoint () {
      if (this.downloadVolume) {
        return `/libcrowds/categories/${this.collection.short_name}/volumes/` +
          `${this.downloadVolume.id}/export`
      }
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
