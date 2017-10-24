<template>
  <div id="collection-data">
    <h1 class="text-center">Data</h1>
    <span v-if="pageContent">
      <span v-html="pageContent"></span>
      <hr class="mx-0">
    </span>

    <projects-table
      :search-params="searchParams"
      success-btn="Download"
      @successclick="loadDataModal">
    </projects-table>

    <data-modal
      v-if="activeProject"
      :show="showDataModal"
      :project="activeProject">
    </data-modal>
  </div>
</template>

<script>
import marked from 'marked'
import { loadAsyncCollection } from '@/mixins/loadAsyncCollection'
import ProjectsTable from '@/components/tables/Projects'
import DataModal from '@/components/modals/Data'

export default {
  layout: 'collection-tabs',

  mixins: [ loadAsyncCollection ],

  data () {
    return {
      activeProject: null,
      showDataModal: false
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
    ProjectsTable,
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
