<template>
  <div id="admin-featured">
    <div class="row">
      <div class="col-md-4">
        <category-list-chooser
          v-if="categories.length"
          header="Categories"
          :categories="categories"
          @change="onCategoryChange">
        </category-list-chooser>
      </div>
      <div class="col-md-8">
        <b-card
          no-block
          v-if="activeCategory"
          :header="`Projects - ${activeCategory.name}`">
          <project-table
            v-if="activeCategory"
            :action="'contribute'"
            :projects="categoryProjects">
          </project-table>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CategoryListChooser from '@/components/category/ListChooser'
import ProjectTable from '@/components/project/Table'

export default {
  data: function () {
    return {
      categories: [],
      projects: {},
      csrf: '',
      activeCategory: null
    }
  },

  metaInfo () {
    return {
      title: `Featured Projects`
    }
  },

  components: {
    CategoryListChooser,
    ProjectTable
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.categories = data.categories
      this.projects = data.projects
      this.csrf = data.csrf
    },

    /**
     * Handle category change.
     * @param {String} category
     *   The category.
     */
    onCategoryChange (category) {
      this.activeCategory = category
    }
  },

  computed: {
    categoryProjects: function () {
      return this.projects[this.activeCategory.short_name]
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get('/admin/featured').then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
