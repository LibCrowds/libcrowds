<template>
  <div id="collection-data">
    <section>
      <h2 class="text-center">Data</h2>
      <hr>
      <p>
        All datasets generated from the experimental crowdsourcing projects
        hosted on this platform are made available under a
        <a :href="localConfig.dataLicense.url" target="_blank">
          {{ localConfig.dataLicense.name }}
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
          <categories-list
            v-if="categories.length"
            :header="collectionConfig.terminology.category"
            :categories="categories"
            @change="onCategoryChange">
          </categories-list>
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

          <pagination
            :pagination="pagination"
            @change="onPageChange">
          </pagination>

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
import localConfig from '@/local.config'
import CategoriesList from '@/components/lists/Categories'
import Pagination from '@/components/Pagination'
import DataModal from '@/components/modals/Data'
import pybossa from '@/api/pybossa'

export default {
  layout: 'tabs',

  data: function () {
    return {
      localConfig: localConfig,
      navItems: [
        { id: 'download', text: 'Download' }
      ],
      page: 1,
      pagination: {
        per_page: 0,
        total: 0
      },
      projects: [],
      activeCategory: null,
      tableFields: {
        name: { label: 'Name' },
        n_volunteers: { label: 'Volunteers' },
        overall_progress: { label: 'Progress' },
        action: { label: 'Action' }
      }
    }
  },

  async asyncData ({ params }) {
    const res = await pybossa.getMicrositeCategories(params.name)
    return {
      categories: res.data.categories,
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
                   ${localConfig.dataLicense.name} license.`
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
    CategoriesList,
    Pagination,
    DataModal
  },

  methods: {
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
      pybossa.getCategory(this.activeCategory.short_name, this.page).then(r => {
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

  created () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>
