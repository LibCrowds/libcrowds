<template>
  <div id="account-projects">
    <div class="container my-5">
      <b-card header="Open Project">
        <div class="row">
          <div class="col-lg-4">
            <category-list-chooser
              header="Categories"
              v-if="categories.length"
              :categories="categories"
              @change="onCategoryChange">
            </category-list-chooser>
          </div>
          <div class="col-lg-8">
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
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import intersection from 'lodash/intersection'
import pybossaApi from '@/api/pybossa'
import CategoryListChooser from '@/components/category/ListChooser'

export default {
  data: function () {
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

  metaInfo () {
    return {
      title: `${this.currentUser.fullname}: Open Project`
    }
  },

  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },

  components: {
    CategoryListChooser
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
    fetchProjects (category) {
      this.projects = []
      let url = `/project/category/${category.short_name}/`
      if (this.page > 1) {
        url += `page/${this.page}/`
      }
      pybossaApi.get(url).then(r => {
        this.projects = r.data.projects
        this.pagination = r.data.pagination
      })
    }
  },

  beforeRouteEnter (to, from, next) {
    let data = {}
    pybossaApi.get(`account/${to.params.username}/projects`).then(r => {
      data = r.data
      return pybossaApi.get('/')
    }).then(r => {
      data.categories = r.data.categories
      data.categoriesProjects = r.data.categories_projects
      next(vm => vm.setData(data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    let data = {}
    pybossaApi.get(`account/${to.params.username}/projects`).then(r => {
      data = r.data
      return pybossaApi.get('/')
    }).then(r => {
      data.categories = r.data.categories
      data.categoriesProjects = r.data.categories_projects
      this.setData(data)
      next()
    })
  }
}
</script>

<style lang="scss">
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
