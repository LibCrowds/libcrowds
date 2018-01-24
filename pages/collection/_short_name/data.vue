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

      <b-tabs ref="tabs" card @input="filter = null">
        <b-tab title="Volumes" no-body active>
          <b-alert
            v-if="unknownProjects.length"
            show
            variant="warning"
            class="mb-0">
            <p class="mb-0">
              The data below is incomplete as the collection contains projects
              associated with a unknown volumes. This will need be fixed
              by a {{ localConfig.name }} administrator.
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
          <volumes-table
            show-details
            :volumes="volumes"
            :filter="filter"
            :filter-by="filterBy">
          </volumes-table>
        </b-tab>

        <b-tab title="Projects" no-body>
          <projects-table
            no-border
            :filter="filter"
            :filter-by="filterBy"
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
        </b-tab>

      </b-tabs>
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
import localConfig from '@/local.config'
import { collectionMetaTags } from '@/mixins/metaTags'
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
import VolumesTable from '@/components/tables/Volumes'

export default {
  layout: 'collection-tabs',

  mixins: [
    fetchCollectionByName,
    filterProjects,
    licenses,
    collectionMetaTags
  ],

  data () {
    return {
      localConfig: localConfig,
      title: 'Data',
      activeProject: null,
      dataModalId: 'data-download-modal',
      filter: null,
      filterBy: 'name'
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/libcrowds/categories/${params.short_name}/volumes`
    return app.$axios.$get(endpoint).then(data => {
      return {
        volumes: data.volumes,
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
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>
