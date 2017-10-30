<template>
  <div id="collection-data">
    <h1 class="text-center">Data</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <b-row
      id="get-started"
      class="collection-nav-item"
      data-title="Get Started">
      <b-col xl="3" class="mb-3">
        <project-sorting-card
          class="mb-3 d-none d-xl-block"
          :collection="collection"
          v-model="searchParams">
        </project-sorting-card>
      </b-col>

      <b-col xl="9">
        <infinite-loading-table
          no-border
          :fields="tableFields"
          domain-object="project"
          :search-params="mergedSearchParams">
          <template slot="action" scope="project">
            <b-btn
              variant="success"
              size="sm"
              block
              @click="loadDataModal(project.item)">
              Download
            </b-btn>
          </template>
        </infinite-loading-table>
      </b-col>
    </b-row>

    <data-modal
      v-if="activeProject"
      :show="showDataModal"
      :project="activeProject">
    </data-modal>

  </div>
</template>

<script>
import merge from 'lodash/merge'
import marked from 'marked'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import DataModal from '@/components/modals/Data'
import ProjectSortingCard from '@/components/cards/ProjectSorting'

export default {
  layout: 'collection-tabs',

  mixins: [ fetchCollectionByName ],

  data () {
    return {
      activeProject: null,
      showDataModal: false,
      tableFields: {
        name: {
          label: 'Name'
        },
        n_tasks: {
          label: 'Tasks',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        },
        overall_progress: {
          label: 'Progress',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        },
        created: {
          label: 'Created',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
        },
        actions: {
          label: 'Actions',
          class: 'text-center'
        }
      },
      searchParams: {}
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
    InfiniteLoadingTable,
    DataModal,
    ProjectSortingCard
  },

  computed: {
    pageContent () {
      return marked(this.collection.info.content.data)
    },

    collection () {
      return this.$store.state.currentCollection
    },

    mergedSearchParams () {
      return merge({}, this.searchParams, {
        category_id: this.collection.id
      })
    }
  },

  methods: {
    loadDataModal (project) {
      this.activeProject = project
      this.showDataModal = true
    }
  },

  mounted () {
    const nodes = document.querySelectorAll('h2')
    this.$store.dispatch('UPDATE_COLLECTION_NAV_ITEMS', nodes)
  }
}
</script>
