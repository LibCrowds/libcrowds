<template>
  <div id="collection-data">
    <section>
      <h1 class="text-center">Data</h1>
      <span v-html="collection.info.content.data"></span>
      <div class="row">

        <div class="col-xl-3 mb-3">
          <!-- <categories-list
            v-if="categories.length"
            :header="collection.info.terminology.category"
            :categories="categories"
            @change="onCategoryChange">
          </categories-list> -->
        </div>

        <div class="col-xl-9">
          <projects-table
            :search-params="searchParams"
            success-btn="Download"
            @successclick="loadDataModal">
          </projects-table>
        </div>

      </div>
    </section>

    <data-modal
      v-if="activeProject"
      :show="showDataModal"
      :project="activeProject">
    </data-modal>

  </div>
</template>

<script>
import { loadAsyncCollection } from '@/mixins/loadAsyncCollection'
import ProjectsTable from '@/components/tables/Projects'
// import CategoriesList from '@/components/lists/Categories'
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
