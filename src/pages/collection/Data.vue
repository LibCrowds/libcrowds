<template>
  <div id="collection-data">
    <section>
      <h2 class="text-center">Data</h2>
      <hr>
      <p>
        All datasets generated from the experimental crowdsourcing projects
        hosted on this platform are made available under a
        <a :href="siteConfig.dataLicense.url" target="_blank">
          {{ siteConfig.dataLicense.name }}
        </a> license.
      </p>
      <p>
        There are three types of dataset available, all of which
        can be downloaded in JSON or CSV format:
      </p>
      <ul>
        <li>
          <strong>Tasks: </strong>
          The {{ collectionConfig.terminology.task }} data.
        </li>
        <li>
          <strong>Task Runs: </strong>
          The {{ collectionConfig.terminology.taskRun }} data.
        </li>
        <li>
          <strong>Results: </strong>
          The final results data.
        </li>
      </ul>
      <p>
        We are keen for these datasets to be used in innovative ways, perhaps
        to further research into new technologies. For instance, the digitised
        images alongside the final results might prove useful for testing
        pattern recognition applications, such as those using OCR or NER
        technologies.
      </p>
      <p v-if="collectionConfig.forumUrl">
        Head over to the
        <a :href="collectionConfig.forumUrl">
          {{ collectionConfig.brand }} Forum
        </a>
        to let us and others know how you have made use of the data, or if you
        have any further enquiries.
      </p>
      <hr>
      <div :id="navItems[0].id" class="row">
        <div class="col-xl-3 mb-3">
          <category-list-chooser
            v-if="categories.length"
            :header="collectionConfig.terminology.category"
            :categories="categories"
            @change="onCategoryChange">
          </category-list-chooser>
        </div>
        <div class="col-xl-9">

          <b-table
            hover
            striped
            show-empty
            :items="projects"
            :fields="tableFields">
            <template slot="overall_progress" scope="project">
              {{ project.item.overall_progress }}%
            </template>
            <template slot="action" scope="project">
              <b-btn
                variant="success"
                size="sm"
                v-b-modal="`data-download-project-${project.item.id}`">
                Download
              </b-btn>
            </template>
          </b-table>

          <project-pagination
            :pagination="pagination"
            @change="onPageChange">
          </project-pagination>
        </div>
      </div>
    </section>

    <data-modal
      v-for="project in projects"
      :key="project.id"
      :modalId="`data-download-project-${project.id}`"
      :project="project">
    </data-modal>
  </div>
</template>

<script>
import siteConfig from '@/siteConfig'
import CategoryListChooser from '@/components/category/ListChooser'
import ProjectPagination from '@/components/project/Pagination'
import DataModal from '@/components/modals/Data'

export default {
  data: function () {
    return {
      siteConfig: siteConfig,
      navItems: [
        { id: 'download', text: 'Download' }
      ],
      page: 1,
      pagination: {
        per_page: 0,
        total: 0
      },
      projects: [],
      categories: [],
      activeCategory: null,
      tableFields: {
        name: { label: 'Name' },
        n_volunteers: { label: 'Volunteers' },
        overall_progress: { label: 'Progress' },
        action: { label: 'Action' }
      }
    }
  },

  metaInfo () {
    return {
      title: 'Data',
      meta: [
        {
          name: 'description',
          content: `All datasets generated from the experimental crowdsourcing
                   projects hosted on this platform are made available under a
                   ${siteConfig.dataLicense.name} license.`
        }
      ]
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  components: {
    CategoryListChooser,
    ProjectPagination,
    DataModal
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.categories = data.categories
    },

    /**
     * Handle category change.
     * @param {String} category
     *   The category.
     */
    onCategoryChange (category) {
      this.activeCategory = category
      this.fetchProjects(category)
    },

    /**
     * Fetch the projects in a category.
     */
    fetchProjects () {
      let url = `/project/category/${this.activeCategory.short_name}/`
      if (this.page > 1) {
        url += `page/${this.page}/`
      }
      pybossaApi.get(url).then(r => {
        this.projects = r.data.projects
        this.pagination = r.data.pagination
      })
    },

    /**
     * Handle page change.
     * @param {Number} page
     *   The page number.
     */
    onPageChange (page) {
      this.page = page
      this.fetchProjects()
    }
  },

  beforeRouteEnter (to, from, next) {
    // Get categories for this collection only
    let key = to.params.collectionname
    let q = `info=collection::${key}&fulltextsearch=1&limit=100`
    let url = `/api/category?${q}`
    pybossaApi.get(url).then(r => {
      // Make sure as the search is not exact
      r.data = {
        categories: r.data.filter(category => {
          return category.info.collection === key
        })
      }
      next(vm => vm.setData(r.data))
    })
  },

  mounted () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>
