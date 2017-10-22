<template>
  <div id="account-projects">
    <b-container class="my-5">
      <b-card no-body header="Open Project">
        <b-card-body class="p-0">
          <b-row no-gutters>
            <b-col lg="4">
              <categories-list
                header="Categories"
                class="nested-left nested-lg"
                v-if="categories.length"
                :categories="categories"
                @change="onCategoryChange">
              </categories-list>
            </b-col>
            <b-col class="p-2">
              <transition
                name="fade"
                mode="out-in"
                appear>
                <b-table
                  v-if="projects.length"
                  responsive
                  striped
                  hover
                  show-empty
                  :items="projects"
                  :fields="tableFields">
                  <template slot="action" scope="project">
                    <b-btn
                      size="sm"
                      variant="success"
                      block
                      :to="{
                        name: 'project-settings',
                        params: {
                          shortname: project.item.short_name
                        }
                      }">
                      Open
                    </b-btn>
                  </template>
                </b-table>
              </transition>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import intersection from 'lodash/intersection'
import CategoriesList from '@/components/lists/Categories'

export default {
  layout: 'default',

  data () {
    return {
      authProjectIds: [],
      categories: [],
      projects: [],
      tableFields: {
        name: { label: 'Name' },
        published: { label: 'Published' },
        action: { label: 'Action' }
      }
    }
  },

  head () {
    return {
      title: `${this.currentUser.fullname}: Open Project`
    }
  },

  components: {
    CategoriesList
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      let authProjects = data.projects_published.concat(data.projects_draft)
      this.authProjectIds = authProjects.map(project => project.id)

      this.categories = data.categories.filter(category => {
        let projects = data.categoriesProjects[category.short_name]
        let projectIds = projects.map(project => project.id)
        if (!projects.length) {
          return false
        } else if (this.currentUser.admin) {
          return true
        }
        return intersection(this.authProjectIds, projectIds).length > 0
      })

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
      this.fetchProjects(category)
    },

    /**
     * Fetch the projects in a category.
     * @param {Object} category
     *   The category.
     */
    fetchProjects () {
      const shortName = this.activeCategory.short_name
      const endpoint = `/project/category/${shortName}/page/${this.page}`
      this.$axios.$get(endpoint).then(data => {
        this.projects = data.projects
        this.pagination = data.pagination
      }).catch(err => {
        this.error({ statusCode: err.statusCode, message: err.message })
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    // let data = {}
    // pybossa.getAccountProjects(to.params.username).then(r => {
    //   data = r.data
    //   return pybossa.client.get('/')
    // }).then(r => {
    //   data.categories = r.data.categories
    //   data.categoriesProjects = r.data.categories_projects
    //   next(vm => vm.setData(data))
    // })
  },

  beforeRouteUpdate (to, from, next) {
    // let data = {}
    // pybossa.getAccountProjects(to.params.username).then(r => {
    //   data = r.data
    //   return pybossa.client.get('/')
    // }).then(r => {
    //   data.categories = r.data.categories
    //   data.categoriesProjects = r.data.categories_projects
    //   this.setData(data)
    //   next()
    // })
  }
}
</script>

<style lang="scss">
@import '~assets/style/settings';

#account-projects {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 400ms ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
