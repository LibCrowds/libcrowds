<template>

  <div id="collection-contribute">

    <section>
      <h2 class="text-center">Contribute</h2>
      <hr>
      <span
        v-if="collectionConfig.contribute"
        v-html="collectionConfig.contribute">
      </span>
      <span v-else>
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
      </span>
      <hr>
      <div class="row">
        <div class="col-xl-3 mb-3">

          <categories-list
            v-if="categories.length"
            :header="collectionConfig.terminology.category"
            :categories="categories"
            @change="onCategoryChange">
          </categories-list>

          <project-sorting-options
            class="mt-3 d-none d-xl-block"
            :view-opts="viewOpts"
            :show-completed="showCompleted"
            @sort="onSort"
            @viewchange="onViewChange"
            @togglecompleted="onToggleCompleted">
          </project-sorting-options>

          <social-media-buttons
            size="sm"
            class="mt-3 d-none d-xl-block text-center">
          </social-media-buttons>

        </div>
        <div id="choose-a-project" class="col-xl-9">
          <span v-if="projects.length">
            <span v-if="filteredProjects.length">

              <transition
                name="fade"
                mode="out-in"
                appear>
                <project-cards-list
                  key="project-list"
                  v-if="activeView === 'list'"
                  :collection-config="collectionConfig"
                  :projects="filteredProjects">
                </project-cards-list>
              </transition>

              <transition
                name="fade"
                mode="out-in"
                appear>
                <b-table
                  v-if="activeView === 'table'"
                  hover
                  striped
                  show-empty
                  :items="projects"
                  :fields="tableFields">
                  <template slot="overall_progress" scope="project">
                    {{ project.item.overall_progress }}%
                  </template>
                  <template slot="action" scope="project">
                    <project-contrib-btn
                      :shortname="project.item.short_name"
                      variant="success">
                    </project-contrib-btn>
                  </template>
                </b-table>
              </transition>

              <pagination
                key="project-pagination"
                v-if="pagination"
                :pagination="pagination"
                @change="onPageChange">
              </pagination>

            </span>
            <span v-else class="text-center">
              <p class="lead">
                There are no projects to display.
              </p>
              <p>
                <small class="d-none d-xl-block">
                  Use the list on the left of the screen to choose another
                  {{ collectionConfig.terminology.category }}, or the sorting
                  options to display any completed projects.
                </small>
                <small class="d-xl-none">
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
import pybossa from '@/api/pybossa'
import { sortBy, forEach } from 'lodash'
import ProjectSortingOptions from '@/components/project/SortingOptions'
import Pagination from '@/components/Pagination'
import ProjectCardsList from '@/components/lists/ProjectCards'
import CategoriesList from '@/components/lists/Categories'
import ProjectContribButton from '@/components/buttons/ProjectContrib'
import SocialMediaButtons from '@/components/buttons/SocialMedia'

export default {
  layout: 'tabs',

  data () {
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
      tableFields: {
        name: { label: 'Name' },
        n_volunteers: { label: 'Volunteers' },
        overall_progress: { label: 'Progress' },
        action: { label: 'Action' }
      },
      activeView: 'list',
      showCompleted: false,
      page: 1,
      pagination: null,
      projects: [],
      featured: [],
      categories: [],
      activeCategory: null
    }
  },

  head () {
    return {
      title: 'Contribute',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Choose a project to contribute towards'
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

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },
    filteredProjects () {
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
    Pagination,
    ProjectCardsList,
    CategoriesList,
    ProjectContribButton,
    SocialMediaButtons
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.categories = data.categories

      if ('featured' in data.categories_projects) {
        const validProjectIds = data.categories.map(category => {
          return data.categories_projects[category.short_name]
        }).reduce((a, b) => {
          return a.concat(b)
        }, []).map(project => {
          return project.id
        })
        this.featured = data.categories_projects.featured.filter(project => {
          return validProjectIds.indexOf(project.id) > -1
        })

        this.categories.unshift({
          id: 'featured',
          short_name: 'featured',
          name: 'Featured',
          description: 'A collection of our current favourites'
        })
      }

      // Add draft after featured otherwise the filtering above breaks
      if (this.currentUser.admin) {
        this.categories.unshift({
          id: 'draft',
          short_name: 'draft',
          name: 'Draft',
          description: 'Works in progress'
        })
      }
    },

    /**
     * Handle category change.
     * @param {String} category
     *   The category.
     */
    onCategoryChange (category) {
      this.activeCategory = category
      this.fetchProjects()
    },

    /**
     * Fetch the projects in the active category.
     */
    fetchProjects () {
      const shortName = this.activeCategory.short_name
      if (shortName === 'featured') {
        this.projects = this.featured
        this.pagination = null
        return
      }

      this.projects = []
      pybossa.getCategory(shortName, this.page).then(r => {
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
    pybossa.getMicrositeCategories(to.params.collectionname).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    pybossa.getMicrositeCategories(to.params.collectionname).then(r => {
      this.setData(r.data)
      next()
    })
  },

  created () {
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
