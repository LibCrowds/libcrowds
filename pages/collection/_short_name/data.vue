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
            :items="annotationTableItems"
            :fields="annotationTableFields">
            <template slot="action" slot-scope="row">
              <download-annotation-data
                :container-iri="row.item.iri"
                :scope="row.item.scope">
              </download-annotation-data>
            </template>
          </b-table>
        </b-tab>

        <!-- Projects downloads tab -->
        <b-tab title="Projects" no-body>
          <projects-table
            ref="projects-table"
            :filter="filter"
            :filter-by="filterBy"
            :collection="currentCollection">
            <template slot="action" slot-scope="project">
              <download-project-data
                :project="project.item">
              </download-project-data>
            </template>
          </projects-table>
        </b-tab>

      </b-tabs>
    </card-base>
  </div>
</template>

<script>
import marked from 'marked'
import capitalize from 'capitalize'
import { collectionMetaTags } from '@/mixins/metaTags'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { filterProjects } from '@/mixins/filterProjects'
import { licenses } from '@/mixins/licenses'
import SortProjectsData from '@/components/data/SortProjects'
import FilterProjectsData from '@/components/data/FilterProjects'
import ProjectsTable from '@/components/tables/Projects'
import CardBase from '@/components/cards/Base'
import DownloadProjectData from '@/components/data/DownloadProjectData'
import DownloadAnnotationData from '@/components/data/DownloadAnnotationData'

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
      title: 'Data',
      filter: null,
      filterBy: 'name',
      annotationTableFields: {
        scope: {
          label: 'Scope',
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
    ProjectsTable,
    CardBase,
    DownloadProjectData,
    DownloadAnnotationData
  },

  computed: {
    pageContent () {
      return marked(this.currentCollection.info.content.data)
    },

    currentCollection () {
      return this.$store.state.currentCollection
    },

    description () {
      if (this.currentCollection.license) {
        return `All datasets generated from ${this.currentCollection.name}
          projects are made available under a
          ${this.dataLicenses[this.currentCollection.license].name} license.`
      }
      return 'Download all task and contribution data.'
    },

    currentUser () {
      return this.$store.state.currentUser
    },

    annotationCollections () {
      return this.currentCollection.info.annotations
    },

    annotationTableItems () {
      return Object.keys(this.annotationCollections).map(key => {
        return {
          scope: capitalize(key),
          iri: this.annotationCollections[key]
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
