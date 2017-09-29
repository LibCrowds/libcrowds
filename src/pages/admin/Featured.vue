<template>
  <div id="admin-featured">
    <b-card header="Set Featured Projects">
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
            no-body
            v-if="activeCategory"
            :header="`Projects - ${activeCategory.name}`">

            <transition
              name="fade"
              mode="out-in"
              appear>
              <b-table
                hover
                striped
                show-empty
                :items="categoryProjects"
                :fields="tableFields">
                <template slot="overall_progress" scope="project">
                  {{ project.item.overall_progress }}%
                </template>
                <template slot="action" scope="project">
                  <b-btn
                    :variant="project.item.featured ? 'warning' : 'success'"
                    size="sm"
                    @click="toggleFeatured(project.item)">
                    {{ getButtonText(project.item.featured) }}
                  </b-btn>
                </template>
              </b-table>
            </transition>

          </b-card>
        </div>
      </div>
    </b-card>
    <b-card
      no-body
      class="mt-4"
      header="Current Featured Projects">
      <b-table
        hover
        striped
        show-empty
        :items="featuredProjects"
        :fields="tableFields">
        <template slot="overall_progress" scope="project">
          {{ project.item.overall_progress }}%
        </template>
        <template slot="action" scope="project">
          <b-btn
            variant="warning"
            size="sm"
            @click="toggleFeatured(project.item)">
            {{ getButtonText(project.item.featured) }}
          </b-btn>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CategoryListChooser from '@/components/category/ListChooser'

export default {
  data: function () {
    return {
      categories: [],
      projects: {},
      csrf: '',
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
      title: `Featured Projects`
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
      this.categories = data.categories
      this.projects = data.projects
      this.csrf = data.form.csrf
    },

    /**
     * Return the featured button text.
     * @param {Boolean} featured
     *   True if the project is featured, false otherwise.
     */
    getButtonText (featured) {
      return featured ? 'Remove from featured' : 'Add to featured'
    },

    /**
     * Add or remove a project from featured.
     * @param {Object} project
     *   The project.
     */
    toggleFeatured (project) {
      pybossaApi({
        method: project.featured ? 'DELETE' : 'POST',
        url: `/admin/featured/${project.id}`,
        data: {
          csrf: this.csrf
        },
        headers: {
          'X-CSRFToken': this.csrf
        }
      }).then(r => {
        project.featured = !project.featured
      }).catch(err => {
        this.$router.push({ name: String(err.response.status) })
      })
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
    },
    featuredProjects: function () {
      return Object.keys(this.projects).map(shortName => {
        return this.projects[shortName].filter(project => {
          return project.featured
        })
      }).reduce((a, b) => {
        return a.concat(b)
      }, [])
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get('/admin/featured').then(r => {
      next(vm => vm.setData(r.data))
    })
  }
}
</script>
