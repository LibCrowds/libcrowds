<template>

  <floating-tabs-layout>

    <section>
      <h2 class="text-center">Contribute</h2>
      <hr>
      <p class="lead text-center">
        Choose a project from the list below to get started!
      </p>
      <p class="text-center mb-0">
        <small>
          For more information see the
          <router-link
            :to="{
              name: 'collection-about',
              params: {
                collectionname: collectionConfig.key
              }
            }">about page.
          </router-link>
        </small>
      </p>
      <hr>
      <div class="row">
        <div class="col-xl-3 mb-3">
          <category-list-chooser
            v-if="categories.length"
            :categories="categories"
            @change="onCategoryChange">
          </category-list-chooser>
        </div>
        <div class="col-xl-9">
          <project-sorting-options
            :views="views"
            :showCompleted="showCompleted"
            @sort="onSort"
            @viewchange="onViewChange"
            @togglecompleted="onToggleCompleted">
          </project-sorting-options>
          <hr>

          <span v-if="projects.length">
            <project-card-list
              v-if="activeView === 'list'"
              :projects="filteredProjects">
            </project-card-list>

            <project-table
              v-if="activeView === 'table'"
              :action="'contribute'"
              :projects="filteredProjects">
            </project-table>

            <project-pagination
              :pagination="pagination"
              @change="onPageChange">
            </project-pagination>
          </span>
        </div>
      </div>
    </section>

  </floating-tabs-layout>

</template>

<script>
import { sortBy, forEach } from 'lodash'
import pybossaApi from '@/api/pybossa'
import ProjectSortingOptions from '@/components/project/SortingOptions'
import ProjectPagination from '@/components/project/Pagination'
import ProjectTable from '@/components/project/Table'
import ProjectCardList from '@/components/project/CardList'
import FloatingTabsLayout from '@/components/layouts/FloatingTabs'
import CategoryListChooser from '@/components/category/ListChooser'

export default {
  data: function () {
    return {
      views: ['list', 'table'],
      activeView: 'list',
      showCompleted: false,
      page: 1,
      pagination: {
        per_page: 0,
        total: 0
      },
      projects: [],
      categories: [],
      activeCategory: null
    }
  },

  props: {
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  computed: {
    filteredProjects: function () {
      return this.projects.filter((project) => {
        if (!this.showCompleted && project.overall_progress === 100) {
          return false
        } else {
          return true
        }
      })
    }
  },

  components: {
    FloatingTabsLayout,
    ProjectSortingOptions,
    ProjectPagination,
    ProjectTable,
    ProjectCardList,
    CategoryListChooser
  },

  metaInfo: {
    title: 'Projects'
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
      this.projects = []
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
     * Handle sort.
     * @param {String} key
     *   The sort key.
     */
    onSort (key) {
      const sortedProjects = sortBy(this.projects, key)
      this.projects = forEach(sortedProjects, function (p) {
        return p
      })
    },

    /**
     * Handle view change.
     * @param {String} view
     *   The view.
     */
    onViewChange (view) {
      this.activeView = view
    },

    /**
     * Handle completed toggle.
     */
    onToggleCompleted () {
      this.showCompleted = !this.showCompleted
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
  }
}
</script>
