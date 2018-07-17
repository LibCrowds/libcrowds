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
          v-model="searchString"
          class="search-control"
          size="sm"
          :placeholder="`Type to search by ${searchKeys.join(', ')}`">
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
          <infinite-loading-table
            ref="projects-table"
            :search-string="searchString"
            :search-keys="searchKeys"
            :fields="projectTableFields"
            :search-params="{
              category_id: currentCollection.id,
              stats: 1,
              all: 1
            }"
            domain-object="project">
            <template slot="action" slot-scope="row">
              <download-project-data
                :project="row.item">
              </download-project-data>
            </template>
          </infinite-loading-table>
        </b-tab>

        <!-- Reports tab -->
        <b-tab title="Reports" no-body>
          <b-table
            responsive
            striped
            hover
            show-empty
            :dark="darkMode"
            :items="reportsTableItems"
            :fields="reportsTableFields">
            <template slot="action" slot-scope="row">
              <b-btn
                size="sm"
                variant="success"
                @click="reportProgress">
                Progress Report
              </b-btn>
            </template>
          </b-table>
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
import { licenses } from '@/mixins/licenses'
import { exportFile } from '@/mixins/exportFile'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import CardBase from '@/components/cards/Base'
import DownloadProjectData from '@/components/data/DownloadProjectData'
import DownloadAnnotationData from '@/components/data/DownloadAnnotationData'

export default {
  layout: 'collection-tabs',

  mixins: [
    fetchCollectionByName,
    licenses,
    collectionMetaTags,
    exportFile
  ],

  data () {
    return {
      title: 'Data',
      searchString: null,
      searchKeys: ['name'],
      annotationTableFields: {
        scope: {
          label: 'Scope',
          sortable: true
        },
        action: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      projectTableFields: {
        name: {
          label: 'Name',
          sortable: true
        },
        'stats.overall_progress': {
          label: 'Progress',
          class: 'text-center d-none d-md-table-cell'
        }
      },
      reportsTableFields: {
        name: {
          label: 'Progress',
          sortable: true
        },
        action: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      reportsTableItems: [
        { name: 'Progress' }
      ]
    }
  },

  components: {
    InfiniteLoadingTable,
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
        this.$nextTick(() => {
          table.reset()
        })
      }
    },

    /**
     * Export progress report.
     */
    reportProgress () {
      const shortName = this.currentCollection.short_name
      const endpoint = `/lc/categories/${shortName}/progress`
      this.$axios.$get(endpoint, {
        params: {
          csv: 1
        }
      }).then(data => {
        this.exportFile(data.progress, `${shortName}_progress`, 'csv')
      })
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('.collection-nav-item')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>
