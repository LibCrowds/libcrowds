<template>
  <div id="admin-featured">
    <b-card no-body header="Set Featured Projects">
      <b-card-body class="p-0">
        <b-row no-gutters>
          <b-col lg="4">
            <categories-list
              v-if="categories.length"
              class="nested-left nested-lg"
              header="Categories"
              :categories="categories"
              @change="onCategoryChange">
            </categories-list>
          </b-col>
          <b-col lg="8" class="p-2">
            <transition
              name="fade"
              mode="out-in"
              appear>
              <b-table
                hover
                striped
                show-empty
                v-if="activeCategory"
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
          </b-col>
        </b-row>
      </b-card-body>
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
import CategoriesList from '@/components/lists/Categories'
import pybossa from '@/api/pybossa'

export default {
  data () {
    return {
      activeCategory: null,
      tableFields: {
        name: {
          label: 'Name'
        },
        n_volunteers: {
          label: 'Volunteers',
          class: 'text-center d-none d-xl-table-cell'
        },
        overall_progress: {
          label: 'Progress',
          class: 'text-center d-none d-xl-table-cell'
        },
        action: {
          label: 'Action',
          class: 'text-center'
        }
      }
    }
  },

  async asyncData () {
    const res = await pybossa.getAdminFeatured()
    return {
      categories: res.data.categories,
      projects: res.data.projects,
      csrf: res.data.form.csrf
    }
  },

  metaInfo () {
    return {
      title: `Featured Projects`
    }
  },

  components: {
    CategoriesList
  },

  methods: {
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
      if (project.featured) {
        pybossa.featureProject(project.id, { csrf: this.csrf }).then(r => {
          project.featured = !project.featured
        })
      } else {
        pybossa.unfeatureProject(project.id, { csrf: this.csrf }).then(r => {
          project.featured = !project.featured
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
    }
  },

  computed: {
    categoryProjects () {
      return this.projects[this.activeCategory.short_name]
    },
    featuredProjects () {
      return Object.keys(this.projects).map(shortName => {
        return this.projects[shortName].filter(project => {
          return project.featured
        })
      }).reduce((a, b) => {
        return a.concat(b)
      }, [])
    }
  }
}
</script>
