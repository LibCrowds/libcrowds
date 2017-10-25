<template>
  <div id="collection-data">

    <h1 class="text-center">Data</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <b-card no-body>
      <infinite-loading-table
        no-border
        :fields="tableFields"
        domain-object="project"
        :search-params="searchParams">
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
    </b-card>

    <data-modal
      v-if="activeProject"
      :show="showDataModal"
      :project="activeProject">
    </data-modal>

  </div>
</template>

<script>
import marked from 'marked'
import { asyncLoadCollection } from '@/mixins/asyncLoadCollection'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import DataModal from '@/components/modals/Data'

export default {
  layout: 'collection-tabs',

  mixins: [ asyncLoadCollection ],

  data () {
    return {
      activeProject: null,
      showDataModal: false,
      customSearchParams: {},
      tableFields: {
        name: {
          label: 'Name'
        },
        n_volunteers: {
          label: 'Volunteers',
          class: 'text-center d-none d-xl-table-cell',
          sortable: true
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
      }
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
    DataModal
  },

  computed: {
    searchParams () {
      return {
        category_id: this.collection.id,
        published: true
      }
    },

    pageContent () {
      return marked(this.collection.info.content.data)
    }
  },

  methods: {
    loadDataModal (project) {
      this.activeProject = project
      this.showDataModal = true
    }
  }
}
</script>
