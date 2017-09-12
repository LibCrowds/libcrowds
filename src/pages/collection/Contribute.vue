<template>

  <div id="collection-contribute">

    <section>
      <h2 class="text-center">Contribute</h2>
      <hr>
      <p class="lead text-center">
        Choose a {{ collectionConfig.terminology.project }} from the list below
        to get started!
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
            :collectionConfig="collectionConfig"
            :categories="categories"
            @change="onCategoryChange">
          </category-list-chooser>

          <project-sorting-options
            class="mt-3 hidden-lg-down"
            :viewOpts="viewOpts"
            :showCompleted="showCompleted"
            @sort="onSort"
            @viewchange="onViewChange"
            @togglecompleted="onToggleCompleted">
          </project-sorting-options>

        </div>
        <div id="choose-a-project" class="col-xl-9">
          <span v-if="projects.length">
            <span v-if="filteredProjects.length">

              <transition
                name="fade"
                mode="out-in"
                appear>
                <project-card-list
                  key="project-list"
                  v-if="activeView === 'list'"
                  :projects="filteredProjects">
                </project-card-list>
              </transition>

              <transition
                name="fade"
                mode="out-in"
                appear>
                <project-table
                  key="project-table"
                  v-if="activeView === 'table'"
                  :action="'contribute'"
                  :projects="filteredProjects">
                </project-table>
              </transition>

              <project-pagination
                key="project-pagination"
                :pagination="pagination"
                @change="onPageChange">
              </project-pagination>

            </span>
            <span v-else class="text-center">
              <p class="lead">
                There are no projects to display.
              </p>
              <p>
                <small class="hidden-lg-down">
                  Use the list on the left of the screen to choose another
                  {{ collectionConfig.terminology.category }}, or the sorting
                  options to display any completed projects for this one.
                </small>
                <small class="hidden-xl-up">
                  Use the list above to choose another
                  {{ collectionConfig.terminology.category }}.
                </small>
              </p>
            </span>

          </span>
          <p v-else class="text-center mb-0">
            No {{ collectionConfig.terminology.project | pluralize }}  have
            been published for this category
          </p>
        </div>
      </div>
    </section>

  </div>

</template>

<script>
import { sortBy, forEach } from 'lodash'
import pybossaApi from '@/api/pybossa'
import ProjectSortingOptions from '@/components/project/SortingOptions'
import ProjectPagination from '@/components/project/Pagination'
import ProjectTable from '@/components/project/Table'
import ProjectCardList from '@/components/project/CardList'
import CategoryListChooser from '@/components/category/ListChooser'

export default {
  data: function () {
    return {
      navItems: [
        {
          id: 'choose-a-project',
          text: `Choose a ${this.collectionConfig.terminology.project}` }
      ],
      viewOpts: [
        { text: 'List', value: 'list' },
        { text: 'Table', value: 'table' }
      ],
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

  metaInfo () {
    return {
      title: 'Contribute',
      description: 'Choose a project to contribute towards'
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
    ProjectSortingOptions,
    ProjectPagination,
    ProjectTable,
    ProjectCardList,
    CategoryListChooser
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
  },

  mounted () {
    this.$emit('navupdated', this.navItems)
  }
}
</script>

<style lang="scss">
#collection-contribute {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 300ms ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
